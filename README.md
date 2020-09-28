# Yuuki - Discord Bot
    Simple bot discord created with node.js,discord.js,ytdl,mongoDB  i named it because i like Yuuki Asuna from Sword art online 

## Table of content
* [General Info](#generalinfo)
* [Command](#command)
* [Technologies](#technologies)
* [Setup](#setup)

## General Info
    This is my simple project discord bot, this bot can play music and manage role


## Command

    ### Music Player

    $play <Music title or you can add the singer> ~ To play music
    > $play anima reona

    $skip ~ To skip the music
    > $skip

    $stop ~ To stop the music
    > $stop

    $leave ~ Leave bot from voice channel
    > $leave

    ### Manage Roles

    $create-role <role-name>-<role-color> ~ To create role with color ( MANAGE ROLE permission required)
    > $create-role Admin-red 

    $delete-role <role-name> ~ To delete role ( MANAGE ROLE permission required)
    > $delete-role Admin

    $list-role ~ Check all init roles
    > $list-role

    ### Initiliaze

    $init-emote ~ Start collect the emote ( MANAGE ROLE permission required)
    \* After bot send message init all roles you need you have 30 sec to collect \*

    $init-list <Message id> ~ To init the list role message ( MANAGE ROLE permission required)
    > $init-list 123456789101112913

    $kick <User Id> ~ To kick member from channel ( MANAGE ROLE permission required)


## Techonologies

    discord.js version : 12.3.1
    node.js version    : 10.19.0
    ytdl-core version  : 3.2.2
    dotenv version     : 8.2.0
    ffmpeg             : [See doc to install](https://ffmpeg.org/)



## Setup

    first time make sure you already installed !
        ffmpeg     : [Official Website](https://ffmpeg.org/)
        node.js    : [Official Website](https://nodejs.org/en/)
        discord.js : [See documentation](https://discord.js.org/#/)
        ### Optional ( You can download direct from github in .zip file)
        GIT        : [Official Website ](https://git-scm.com/)
    
    Already install it ? all let's to clone the repo and install all package !
    open your terminal or cmd with git installed there and follow instruction below 
    ps : Don't type "$" in your terminal you can ignore it

    $ git clone https://github.com/Zuans/zuans-book.git

    after complete the clone the repo make file with name .env file and add follow variable at this file 
    DISCORD_BOT_TOKEN=/*Make your own discord in/*[Discord developer](https://discord.com/developers/applications)
