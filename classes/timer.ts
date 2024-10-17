import { EventEmitter } from "stream";
export class Timer extends EventEmitter {
    // Properties
    time: string;
    guildId: string;
    userId: string;

    constructor(timestring, guildId = null, userId = null) {
        super()
        this.time = timestring
        this.guildId = guildId
        this.userId = userId
    }
    public isTicking = false; 
    private regexArray = [/(\d+d)/, /(\d+h)/, /(\d+m)/, /(\d+s)/, /(\d+ms)/] // Example: 30d12h12m2s3ms
    async start(){
        const itself = this
        const isTicking = this.isTicking
        let timeInMilliseconds: number = 0;
        this.regexArray.forEach(regex => {
            let match = this.time.match(regex)
            let result = match ? Number(match[0].replace(/[a-zA-Z]+/, '')) : 0
            if(result !== 0){
                switch(this.regexArray.indexOf(regex)){
                    case 0:
                        timeInMilliseconds += (result*86400000)
                        break;
                    case 1:
                        timeInMilliseconds += (result*3600000)
                        break;
                    case 2:
                        timeInMilliseconds += (result*60000)
                        break;
                    case 3:
                        timeInMilliseconds += (result*1000)
                        break;
                    case 4:
                        timeInMilliseconds += result
                        break;
                }
            }
        })
        console.log({ time: timeInMilliseconds})
        if(!isTicking){
            setTimeout(function (){
                itself.emit("timerDone")
                itself.isTicking = false;
            }, timeInMilliseconds)
        }

    }
    
    
    

}