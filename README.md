# disdelete
A lightning fast Discord message deletion tool for any channel or DM.

>⚠️ *Please be aware that user account automation may result in account termination.*
>*For more information, have a look [here](https://support.discord.com/hc/en-us/articles/115002192352-Automated-user-accounts-self-bots-).*

![disdelete_running](https://i.imgur.com/OZPIYFb.gif)

disdelete is a modern request-based Discord message delete script. 
It is specifically designed to delete messages quickly and efficiently.

This **does not** use any Discord library. Simple websockets and full fledged raw requests.

## Requirements

Please make sure nodejs is installed and please use the `git clone` command or just download manually.

## Install

Install all dependencies.

```sh
npm i
```

## Setup

Simply edit the line below with your Discord authentication token.
If you don't know how to get your token, check [here](https://linuxhint.com/get-discord-token/).

```sh
authentication_token = 'put-your-token-here'
```

## Usage

```sh
node .
```

From here, all you need to do is run is type `.d` into any channel and the delete script will run.
