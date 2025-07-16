# Clingo

The most important command when working with clingo is `l2b model-permissions <project> -d`, where `-d` shows debug information. This command will produce two files under a project, a `clingo.input.lp` file and a `clingo.output.lp` file. The `clingo.input.lp` file is generated from the `discovered.json` file of the project with the help of the `_clingo/modelPermissions.lp` file. Then, when this file is executed through the command already mentioned, it will produce the `clingo.output.lp` file.
