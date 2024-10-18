# cs7319-architecture-project

First:  
git init  
git branch -M main  
git remote add origin git@github.com:dgsmith7/cs7319-architecture-project.git  
git pull

later:  
git pull  
add your files / make changes, then:  
git add .  
git commit -m "some meaningful message about what you did"  
git push -u origin main

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