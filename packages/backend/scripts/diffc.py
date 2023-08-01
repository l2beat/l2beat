import os
import argparse
import subprocess
import pty
import sh

# List of keywords to ignore in directory names
IGNORE_KEYWORDS = ["Multisig", "AddressManager", "ProxyAdmin", "Gnosis"]


def get_project_structure(base_path, folder_name, directory):
    # Add more possible directories here, with a logical name as the key
    possible_directories = {
        "main_contracts": os.path.join(base_path, "discovery", folder_name, "ethereum", ".code", directory, "implementation", "contracts"),
        "bedrock_contracts": os.path.join(base_path, "discovery", folder_name, "ethereum", ".code", directory, "implementation", "optimism/packages/contracts-bedrock/contracts"),
        # Add more paths here...
    }

    for logical_name, path in possible_directories.items():
        if os.path.exists(path):
            return path, logical_name

    return None, None


def list_directories(folder_name):
    base_path = ".."
    path = os.path.join(base_path, "discovery",
                        folder_name, "ethereum", ".code")

    try:
        entries = os.listdir(path)
        directories = [
            entry
            for entry in entries
            if os.path.isdir(os.path.join(path, entry))
            and not any(keyword in entry for keyword in IGNORE_KEYWORDS)
        ]
        ignored_directories = [
            entry for entry in entries if any(keyword in entry for keyword in IGNORE_KEYWORDS)
        ]

        return set(directories), set(ignored_directories)
    except FileNotFoundError:
        print(f"The directory {path} does not exist.")
        return set(), set()
    except NotADirectoryError:
        print(f"{path} is not a directory.")
        return set(), set()


def diff_proxies(folder1, folder2, common_directories):
    base_path = ".."
    print("\nComparing proxies...")
    no_changes = True

    for directory in common_directories:
        path1 = os.path.join(base_path, "discovery", folder1,
                             "ethereum", ".code", directory, "proxy")
        path2 = os.path.join(base_path, "discovery", folder2,
                             "ethereum", ".code", directory, "proxy")

        if not os.path.exists(path1):
            print(f"'proxy' subdirectory does not exist in {path1}")
            continue
        if not os.path.exists(path2):
            print(f"'proxy' subdirectory does not exist in {path2}")
            continue

        sol_files1 = [os.path.join(root, f) for root, dirs, files in os.walk(
            path1) for f in files if f.endswith('.sol')]
        sol_files2 = [os.path.join(root, f) for root, dirs, files in os.walk(
            path2) for f in files if f.endswith('.sol')]

        common_sol_files = set(sol_files1) & set(sol_files2)

        for sol_file in common_sol_files:
            file1 = sol_file.replace(folder1, folder1)
            file2 = sol_file.replace(folder1, folder2)

            # Run "forge fmt" on each file before diffing
            # subprocess.run(["forge", "fmt", file1])
            # subprocess.run(["forge", "fmt", file2])

            pid, fd = pty.fork()
            if pid == 0:  # child process
                os.execvp("difft", ["difft", file1, file2])
            else:  # parent process
                result = os.read(fd, 1024).decode()
                if "No changes." not in result:
                    print(f"Comparing {file1} and {file2}")
                    print(result)
                    no_changes = False

    if no_changes:
        print("No changes in proxies.")


def diff_implementations(folder1, folder2, common_directories):
    base_path = ".."
    print("\nComparing implementations...")
    no_changes = True

    # Determine the project structure
    # use the first directory to determine the project structure
    dummy_directory = next(iter(common_directories))
    path1, _ = get_project_structure(base_path, folder1, dummy_directory)
    path2, _ = get_project_structure(base_path, folder2, dummy_directory)

    # Iterate over directories
    for directory in common_directories:
        # Replace the dummy directory with the current directory
        dir_path1 = path1.replace(dummy_directory, directory)
        dir_path2 = path2.replace(dummy_directory, directory)

        if not os.path.exists(dir_path1) or not os.path.exists(dir_path2):
            print("Neither 'contracts' nor 'optimism/packages/contracts-bedrock/contracts' directory exists in " + directory + ".")
            continue

        sol_files1 = [os.path.join(root, f) for root, dirs, files in os.walk(
            dir_path1) for f in files if f.endswith('.sol')]
        sol_files2 = [os.path.join(root, f) for root, dirs, files in os.walk(
            dir_path2) for f in files if f.endswith('.sol')]

        # Map to common format
        sol_files1 = {f.replace(dir_path1, "<placeholder>")
                      for f in sol_files1}
        sol_files2 = {f.replace(dir_path2, "<placeholder>")
                      for f in sol_files2}

        common_sol_files = sol_files1 & sol_files2

        for sol_file in common_sol_files:
            file1 = sol_file.replace(
                "<placeholder>", dir_path1).replace(folder1, folder1)
            file2 = sol_file.replace(
                "<placeholder>", dir_path2).replace(folder1, folder2)

            # Run "forge fmt" on each file before diffing
            # subprocess.run(["forge", "fmt", file1])
            # subprocess.run(["forge", "fmt", file2])

            pid, fd = pty.fork()
            if pid == 0:  # child process
                os.execvp("difft", ["difft", "--skip-unchanged",
                          "--ignore-comments", file1, file2])
            else:  # parent process
                result = b""
                while True:
                    try:
                        chunk = os.read(fd, 1024)
                        if not chunk:  # no more data
                            break
                        result += chunk
                    except OSError:
                        break
                result = result.decode()
                if "No changes." not in result:
                    # print(f"Comparing {file1} and {file2}")
                    print("---")
                    print(result)
                    no_changes = False

    if no_changes:
        print("No changes in implementations.")


def main():
    parser = argparse.ArgumentParser(
        description="List directories within a specified directory and compare proxies.")

    parser.add_argument("Folder_Name1", metavar="folder_name1",
                        type=str, help="the first folder name to list directories")
    parser.add_argument("Folder_Name2", metavar="folder_name2",
                        type=str, help="the second folder name to list directories")

    args = parser.parse_args()

    directories1, ignored1 = list_directories(args.Folder_Name1)
    directories2, ignored2 = list_directories(args.Folder_Name2)

    common_directories = directories1 & directories2
    unique_to_folder1 = directories1 - directories2
    unique_to_folder2 = directories2 - directories1
    ignored_directories = ignored1 | ignored2

    RED = "\033[31m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    RESET = "\033[0m"

    if common_directories:
        print("Common Directories:")
        for directory in common_directories:
            print(directory)

    if unique_to_folder1:
        print("\nDirectories unique to " + args.Folder_Name1 + ":")
        for directory in unique_to_folder1:
            print(RED + directory + RESET)

    if unique_to_folder2:
        print("\nDirectories unique to " + args.Folder_Name2 + ":")
        for directory in unique_to_folder2:
            print(GREEN + directory + RESET)

    if ignored_directories:
        print("\nIgnored Directories:")
        for directory in ignored_directories:
            print(YELLOW + directory + RESET)

    diff_proxies(args.Folder_Name1, args.Folder_Name2, common_directories)
    diff_implementations(
        args.Folder_Name1, args.Folder_Name2, common_directories)


if __name__ == "__main__":
    main()
