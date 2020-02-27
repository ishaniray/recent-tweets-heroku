create table if not exists SearchedTerms (
    Id int primary key auto_increment,
    Hashtag varchar(255) not null,
    ResultType varchar(255) not null,
    SearchedAt timestamp not null
);

create table if not exists UserRatings (
    Id int primary key auto_increment,
    Rating int not null,
    PostedAt timestamp not null
);
