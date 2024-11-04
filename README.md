# CS7319 Final Project - Group 7

Here are the list of softwares needed to run the project.

1. NodeJS - Minimum Version v18
1. MySQL - Community Server 8.4.3 LTS
1. RabbitMQ - Minimum Version v4
1. Visual Studio Code - Minimum Version 1.89 or another IDE to support NodeJS and ReactJS Development
1. Git Tools - Latest Version


## Install NodeJS for MacOS using bash:

1. Installs nvm (Node Version Manager)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
```

2. Download and install Node.js (you may need to restart the terminal)

```bash
nvm install 20
```

3. Verifies the right Node.js version is in the environment

```bash
node -v # should print `v20.18.0`
```

4. Verifies the right npm version is in the environment

```bash
npm -v # should print `10.8.2`
```

## Install NodeJS for Windows using fnm:

1. Installs fnm (Fast Node Manager)

```fnm
winget install Schniz.fnm
```

2. Configure fnm environment

```fnm
fnm env --use-on-cd | Out-String | Invoke-Expression
```

3. Download and install Node.js

```fnm
fnm use --install-if-missing 20
```

4. Verifies the right Node.js version is in the environment

```fnm
node -v # should print `v20.18.0`
```

5. Verifies the right npm version is in the environment

```fnm
npm -v # should print `10.8.2`
```

## Install MySQL

If MySQL is already installed ignore below steps

1. Downlod the installation package from https://dev.mysql.com/downloads/mysql/

- Recommended version: MySQL Community Server 8.4.3 LTS
- Note: you do not need t login to download the installation package. Looks for the option to download without login.

2. During installation, when prompted for root user password use "mysmu@123" or based on your preference.
3. Downalod MySQL Workbench installation package from https://dev.mysql.com/downloads/workbench/
4. Connect to the local MySQL instance from MySQL Workbench and run the sql script from DB folder

## Install RabbitMQ

If RabbitMQ is already installed, please ignore these steps.

Based on the operating system, download and install RabbitMQ 
https://www.rabbitmq.com/docs/platforms

#### For macOS, the recommended option is to use <b>Homebrew</b>
```bash
brew update
```
```bash
brew install rabbitmq
```
To find out locations for your installation, use:
```bash
brew info rabbitmq
```
Run the RabbitMQ Server Node as a background service

```bash
brew services start rabbitmq
```

Highly recommended: enable all feature flags on the running node

For Apple Silicon Macs
```bash
/opt/homebrew/sbin/rabbitmqctl enable_feature_flag all
```
For Intel Macs
```bash
/usr/local/opt/rabbitmq/sbin/rabbitmqctl enable_feature_flag all
```

For Stopping the service
```bash
brew services stop rabbitmq
```

#### For Winddows, the recommended option is to use <b>Chocolatey</b>

To install RabbitMQ using Chocolatey, run the following command from the command line or from PowerShell:

```ps
choco install rabbitmq
```

More information can be foound here.
https://www.rabbitmq.com/docs/install-windows#chocolatey


## Install Git Tools

Install Git Tools from below URL.
https://git-scm.com/downloads


## Install Visual Studio Code

Install latest version of Visual Studio Code from below URL
https://code.visualstudio.com/download


## Clone the Git Repository

Create new folder
```bash
md CS7319-Final-Project-Group07-Smith-Sreepada-Alavala
```
Change to new folder
```bash
cd CS7319-Final-Project-Group07-Smith-Sreepada-Alavala
```

Clone Git Repository
```bash
git clone https://github.com/CS7319-Architecture-Group7/CS7319-Final-Project-Group07-Smith-Sreepada-Alavala.git
```


## Before running the application

### Set up the Local Environment:
1. Run the DB Scripts from ./DB/PollManagement_SQL_Script_DDL.sql in MySQL Workbench to create PollManagement database schema with all necessary SQL Objects.
2. You should have received the .env files for frontend and backend applications through email. If not, please send us an email.
3. Copy the FrontEnd ".env" file for frontend application in "./selected/frontend" and "./unselected/frontend/" folders
4. Copy the BackEnd ".env" file for backend application in "./selected/backend" and "./unselected/backend/" folders

## Running the "selected" application.

1. Open two terminals in MacOS or two Command Prompts in Windows OS.
2. Navigate to "./selected/backend/" folder in frist terminal or command prompt and run below commands
```bash
npm install
npm run dev
```
If there are no errors, backend application must start and listen to port 5001 on localhost

3. Navigate to "./selected/frontend/" folder in second terminal or command prompt and run below commands
```bash
npm install
npm start
```
If there are no errors, frontend application must start and listen to port 3001 on localhost as well as open the default browser

Open additional browsers for testing the poll updates.
We recommend to have 3 browsers in below layout to observe the Poll Result updates in a better way.


<table border=2 width=100%>
    <tr>
        <td align=center>Browser 1</td>
        <td align=center rowspan="2">Browser 3</td>
    </tr>
    <tr>
        <td align=center>Browser 2</td>
    </tr>
</table>

Use Browser 3 for all the changes like, creating, updating, and delting polls. Once enough polls are created, use Browser 1 and 2 to observe the Poll results when polls are voted from Browser 3.

### Running the "unselected" application

Repeat the same steps above in "./unselected/" folder.

## Difference between the architecture designs for both candidate architecture styles

TBD

## The rationales for final selection

TBD

## Any other useful information about the architectural design decisions

TBD