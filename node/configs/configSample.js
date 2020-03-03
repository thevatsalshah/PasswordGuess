/****************************
 Configuration
 ****************************/
module.exports = {
    db: 'mongodb://10.2.99.11/seed_project_v10',
    mongoDBOptions: {
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        keepAlive: 1,
        connectTimeoutMS: 30000,
        useNewUrlParser: true,
        useFindAndModify: false,
        native_parser: true,
        poolSize: 5,
        user: 'seed_project_v10',
        pass: 'seed_project_v10'
    },
    sessionSecret: 'indNIC2305',
    securityToken: 'indNIC2305',
    securityRefreshToken: 'indNIC2305refresh',
    baseApiUrl: '/api',
    host: "10.2.99.23",
    serverPort: '4000',
    tokenExpiry: 361440, // Note: in seconds! (1 day)
    adminEmails: 'chandrakanta@indianic.com,chandrakanta1@indianic.com,chandrakanta2@indianic.com',
    rootUrl: 'http://10.2.99.23:4000/api',
    frontUrl: 'http://10.2.99.23:4003',
    frontUrlAngular: 'http://10.2.99.23:4002/#/public',
    defaultEmailId: 'meanstack2017@gmail.com',
    adminUrl: "https://node.indianic.com:4070/#/resetPassword",
    apiUrl: 'http://10.2.99.23:4000',
    perPage: 20,
    adPerPage: 4,
    s3upload: false,

    dontAllowPreviouslyUsedPassword: true,
    storePreviouslyUsedPasswords: true,

    forceToUpdatePassword: true,
    updatePasswordPeriod: 4, // In months

    allowedFailAttemptsOfLogin: 5,
    isBlockAfterFailedAttempt: true,
    timeDurationOfBlockingAfterWrongAttempts: 15, // In minutes

    tokenExpirationTime: 540, // minutes
    forgotTokenExpireTime: 60, // minutes
    verificationTokenExpireTime: 60, // minutes

    extendTokenTime: true,
    useRefreshToken: true,

    isHTTPAuthForSwagger: false,
    HTTPAuthUser: "root",
    HTTPAuthPassword: "root"
};
