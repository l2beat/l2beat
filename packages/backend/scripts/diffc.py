import os
import argparse
import pty
import shutil

if shutil.which("difft") is None:
    print("Error: 'difft' command is not found. Please install it and make sure it's in your PATH.")
    exit(1)


RED = "\033[31m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
WHITE = "\033[37m"
BOLD = "\033[1m"
RESET = "\033[0m"

terminal_size = os.get_terminal_size()
terminal_width = terminal_size.columns

# List of keywords to ignore in directory names
IGNORE_KEYWORDS = ["Multisig", "AddressManager", "ProxyAdmin", "Gnosis"]


def get_project_subpath(base_path: str, folder_name: str, directory: str) -> tuple[str, str]:
    possible_directories = {
        "main_contracts": "implementation/contracts",
        "bedrock_contracts": "implementation/optimism/packages/contracts-bedrock/contracts",
        # Add more paths here...
    }

    for logical_name, subpath in possible_directories.items():
        full_path: str = os.path.join(
            base_path, "discovery", folder_name, "ethereum", ".code", directory, subpath)
        if os.path.exists(full_path):
            return subpath, logical_name

    print(f"Error: Could not determine project structure for {folder_name}.")
    exit(1)


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
    print(BOLD + "\nComparing proxies..." + RESET)
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
    print(BOLD + "\nComparing implementations..." + RESET)

    # Determine the project structure
    # use the first directory to determine the project structure
    dummy_directory = next(iter(common_directories))
    subpath1, logical_name1 = get_project_subpath(
        base_path, folder1, dummy_directory)
    subpath2, logical_name2 = get_project_subpath(
        base_path, folder2, dummy_directory)

    # Iterate over directories
    for directory in common_directories:
        no_changes = True
        directory_title = " {0} ".format(directory)
        num_dashes = (terminal_width - len(directory_title)) // 2
        print(f"\n{'-' * num_dashes}{directory_title}{'-' * num_dashes}\n")

        # Construct the directory paths for the current directory
        dir_path1 = os.path.join(
            base_path, "discovery", folder1, "ethereum", ".code", directory, subpath1)
        dir_path2 = os.path.join(
            base_path, "discovery", folder2, "ethereum", ".code", directory, subpath2)

        if not os.path.exists(dir_path1):
            print(
                f"{folder1} does not contain {directory} with project structure {logical_name1}.")
            continue
        if not os.path.exists(dir_path2):
            print(
                f"{folder2} does not contain {directory} with project structure {logical_name2}.")
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
                          "--ignore-comments", "--width", str(terminal_width), file1, file2])
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
                    # Split result into lines
                    lines = result.split('\n')
                    # Only print lines that are not empty
                    for line in lines:
                        if line.strip():  # This checks if line is not empty when whitespace is removed
                            print(line)
                    if (line not in [""]):
                        no_changes = False

        if no_changes:
            print("No changes in implementations.")


def print_directories(directories, message, color):
    print("\n" + color + message + RESET)
    if directories:
        for directory in directories:
            print(directory)
    else:
        print("NONE")


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

    print_directories(common_directories,
                      "Common Directories:", WHITE)
    print_directories(unique_to_folder1,
                      "Directories unique to " + args.Folder_Name1 + ":", RED)
    print_directories(unique_to_folder2,
                      "Directories unique to " + args.Folder_Name2 + ":", GREEN)
    print_directories(ignored_directories,
                      "Ignored Directories:", YELLOW)

    diff_proxies(args.Folder_Name1, args.Folder_Name2, common_directories)
    diff_implementations(
        args.Folder_Name1, args.Folder_Name2, common_directories)


if __name__ == "__main__":
    main()
