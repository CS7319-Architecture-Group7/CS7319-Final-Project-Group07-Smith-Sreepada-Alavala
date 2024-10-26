# cs7319-architecture-project

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

1. nstalls fnm (Fast Node Manager)

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