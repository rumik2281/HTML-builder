async function writeToFile() {
      const fs = require('fs');
      const path = require('path');
      const { stdin: input, stdout: output, stdout } = require('process'); 
      const readline = require('readline');
      const write = fs.createWriteStream(path.join(__dirname, 'destination.txt'));
      const readl = readline.createInterface({ input, output });
      process.on('exit', () => {
          console.log("Завершение работы");
      });
      stdout.write('Введите строку ')
      readl.on('line', answer => {
        if(answer.trim() !== "exit") {
          write.write(answer + "\n");
        } else {
          readl.close();
        }
      });
  }
  writeToFile()