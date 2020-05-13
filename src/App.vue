<template>
    <div id="app">
        <input placeholder="宽度" v-model="width" />
        <input placeholder="高度" v-model="height" />
        <input placeholder="雷数" v-model="minesCount" />
        
        <button @click="revive">复活</button>
        <span v-text="totalTime" v-show="totalTime"></span>
        <MineSweeper
            v-if="reflashHack"
            :GamemapX="width?width:15"
            :GamemapY="height?height:15"
            :Mines="minesCount?minesCount:30"
            :gameOver="this.gameOver"
            :win="this.win"
        />
    </div>
</template>

<script>
import MineSweeper from "./components/MineSweeper.vue";

export default {
    data() {
        return {
            name: "App",
            width: "",
            height: "",
            minesCount: "",
            reflashHack: true,
            beginTime:new Date().getTime(),
            totalTime:"",
            interval:null
            
        };
    },
    components: {
        MineSweeper
    },
    mounted(){
        this.interval=setInterval(() => {
            let second=Math.round((new Date().getTime()-this.beginTime)/1000);
            this.totalTime=" 已用时间: "+Math.floor(second/60)+":"+(second%60>=10?second%60:"0"+second%60)
        }, 1);
    },
    methods: {
        revive() {
            this.reflashHack = false;
            this.$nextTick(() => {
                this.reflashHack = true;
            });
            this.beginTime=new Date().getTime();
            clearInterval(this.interval)
            this.interval=setInterval(() => {
            let second=Math.round((new Date().getTime()-this.beginTime)/1000);
            this.totalTime=" 已用时间: "+Math.floor(second/60)+":"+(second%60>=10?second%60:"0"+second%60)
        }, 1);
        },
        gameOver(){
            alert("炸弹爆炸. 你的耗时: "+this.totalTime.slice(7));
            clearInterval(this.interval);
        },
        win(){
            alert("排雷结束. 你的耗时: "+this.totalTime.slice(7));
            clearInterval(this.interval);
        }
    }
};
</script>

<style>
</style>
