var env = process.env.NODE_ENV || 'production';

if(env === "development") {
    global.AUTH = {
        bdd_ip: 'localhost',
        bdd_port: 6033,
        url_front: 'http://localhost:4000',
        env: "development"
    };

} else if(env === "production") {
    global.AUTH = {
        bdd_ip: 'db',
        bdd_port: 6033,
        url_front: 'https://92.188.98.73:8061',
        env: "production"
    };

}