const build_configuration = {

    "os": "ubuntu", /* change this with the name of your operating system */
    "server_file_url": "https://piston-data.mojang.com/v1/objects/6bce4ef400e4efaa63a13d5e6f6b500be969ef81/server.jar" /* 1.21.8 server jar file url */
    
};

const fs = require("node:fs"),
      https = require("node:https");

/**
* @param {string} command
**/
function run_command(command) { /* function which works no matter the operating system used by the user */
    
    let { spawn } = require("node:child_process"); /* creates a variable called spawn that will permit to run commands */
    
    let shell_process = spawn(command, {detached: true, shell: true, windowsHide: true}); /* creates a new variable that will contain the callback functions of the command shell */

    shell_process.stdout.on("data", function(data) { /* when there is a result */

        console.log(`${command} result : ${data}`); /* push the result data into the result var */
        
    });

    shell_process.kill(); /* kill the shell process and permit to release datas from the RAM */
    
};

function run_jar_and_build_server() { /* function that only works for Linus based operating systems for now, works on MSYS2 and Termux */

    run_command(`mkdir ${__dirname}/notchian/ ${__dirname}/notchian/generated/ ${__dirname}/notchian/generated/data/ ${__dirname}/notchian/generated/data/minecraft`); /* creates the folders neceary for the compilation to work properly */

    /*let request_url = new URL(build_configuration["server_file_url"]);
    fs.writeFileSync(`${__dirname}/notchian/server.jar`, https.request({method: "GET", host: request_url.host, port: 443, path: request_url.pathname, keepAlive: 600, rejectUnauthorized: true}, function(res) {

        let server_jar_file_content = "";
            
        res.setEncoding("utf8");
        res.on("data", function(data) {

            server_jar_file_content += data;
                
        });
        res.on("end", function() {

            return server_jar_file_content;
            console.log("Downloaded the server.jar file content successfully !");
                
        });
        res.on("error", function(err) {

            console.log(err);
                
        });
            
    }), "utf8"); this part of the code is not fully built yet*/
    
    run_command(`sudo chmod +x ${__dirname}/extract_registries.sh`); /* makes the extract_registries.sh file usable */
    run_command(`sudo chmod +x ${__dirname}/build.sh`); /* same as for extract_registries.sh */
    run_command(`sudo wget -O ${__dirname}/notchian/server.jar ${build_configuration["server_file_url"]}`); /* downloads the server.jar file */
    run_command(`java -jar ${__dirname}/notchian/server.jar`); /* launches the minecraft server so that all the folders and files get created ( a small verification system could be implemented later on ) */
    run_command(`sudo ${__dirname}/extract_registries.sh`); /* runs the extract_registries.sh file */
    run_command(`sudo ${__dirname}/build.sh`); /* runs the build.sh file to build */
    console.log(`Your bareiron executable file has been built successfully !`);
    
};

if (String(build_configuration["os"]).toLowerCase() === "debian" || String(build_configuration["os"]).toLowerCase() === "ubuntu") {
    
    run_command("sudo apt update -y && sudo apt upgrade -y"); /* udpates all the server apps */
    run_command("sudo apt install clang default-jre wget -y"); /* install the latest release of gcc and java */
    
    run_jar_and_build_server(); /* launch the build function */

};
