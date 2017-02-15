# ![pageres](public/images/mula.png)

Mula simplifies the expense submission process at RL Solutions. Mula consists of a mobile app and server. This project contains the API server which stores receipts and prepare expenses for submission. The API server is a node.js application, utilizing MongoDB for storage, and imagemagick and pdftk for image and PDF manipulation. The server has been tested on Ubuntu 14.04 LTS.

### Installation & Configuration
Clone this repository and run `npm install` to install the node.js depdencies. 

A few additional packages are required. For Debian based OS':
```
sudo apt-get install imagemagick
sudo apt-get install pdftk
```

To configure Mula for your environment, edit `config.js` in the repository. 

Mula also depends on a Windows service to process and generate the expense spreadsheets. See [mula-generator](https://github.com/jasonhadi/mula-generator) for more information.
