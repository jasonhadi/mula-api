var config = {};

config.key = 'PATH/TO/KEY.pem';
config.cer = 'PATH/TO/CERT.pem';

config.mongodb = {};
config.mongodb.development = 'mongodb://devlopment/mongo';
config.mongodb.test = 'mongodb://test/mongo';
config.mongodb.production = 'mongodb://prod/mongo';

config.mssql = {};
config.mssql.server = 'GPSERVER';
config.mssql.database = 'GPDATABASE';
config.mssql.user = 'GPUSER';
config.mssql.password = 'GPPWD';

config.ldap = {
	server: {
		url: 'ldap://DOMAINCONTROLLER',
		bindDn: 'cn=USER,cn=users,dc=test,dc=local',
		bindCredentials: 'PASSWORD',
		searchBase: 'CN=users,DC=test,DC=local',
		searchFilter: '(sAMAccountName={{username}})'
	}
};

config.jwtsecret = 'JWTSECRET';

config.nodemailer = {};
config.nodemailer.host = 'SMTPSERVER';
config.nodemailer.port = '25';

config.test = {};
config.test.username = 'USER';
config.test.password = 'PASSWORD';

module.exports = config;
