create table `2fa`
(
    token    varchar(255) null,
    username varchar(255) null,
    ip       varchar(255) null
);

create table ip_adresse
(
    id       int auto_increment
        primary key,
    username varchar(255) null,
    ip       varchar(255) null,
    constraint ip_adresse_id_uindex
        unique (id)
);

create table navigator
(
    id        int auto_increment
        primary key,
    username  varchar(255) null,
    navigator text         null,
    constraint navigator_id_uindex
        unique (id)
);

