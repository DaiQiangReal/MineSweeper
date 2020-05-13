<template>
    <div id="Gamemap" onselectstart="return false">
        <div id="row" v-for="(row, y) in this.Gamemap" :key="y">
            <div
                id="oneGrid"
                v-for="(grid, x) in row"
                @click="gridClicked(x, y)"
                :style="isOpened[y][x] ? { backgroundColor: 'white' } : {}"
                @click.right="gridRightClicked(x, y)"
                @click.right.prevent
                :key="x"
            >
                <div id="gridFlag" v-show="!isOpened[y][x] && isFlaged[y][x]">⊗</div>
                <div
                    id="gridNumber"
                    v-show="isOpened[y][x] && NumberOnGamemap[y][x] !== false"
                    v-text="NumberOnGamemap[y][x] === 0 ? '' : NumberOnGamemap[y][x]"
                />
                <div id="gridMine" v-show="over && Gamemap[y][x]">☢</div>
            </div>
        </div>
    </div>
</template>

<script>
import "./css/MineSweeper.css";
import { randomInt } from "./js/Utils";
import Vue from "vue";
export default {
    name: "MineSweeper",
    props: ["GamemapX", "GamemapY", "Mines","gameOver","win"],
    data() {
        return {
            Gamemap: [],
            isOpened: [],
            isFlaged: [],
            NumberOnGamemap: [],
            start: false,
            over: false
        };
    },
    beforeMount() {
        if(this.GamemapX>50)
            this.GamemapX=50;
        if(this.GamemapY>30)
        this.GamemapY=30;
        if(this.Mines>this.GamemapX*this.GamemapY){
            this.Mines=this.GamemapX*this.GamemapY-1
        }
        let init = [];
        for (let y = 0; y < this.GamemapY; y++) {
            let temp = [];
            for (let x = 0; x < this.GamemapX; x++) {
                temp.push(false);
            }
            init.push(temp);
        }
        this.Gamemap = init;
        this.isOpened = JSON.parse(JSON.stringify(init));
        this.isFlaged = JSON.parse(JSON.stringify(init));
        this.NumberOnGamemap = JSON.parse(JSON.stringify(init));
    },
    methods: {
        gridClicked(x, y) {
            if (this.over) return;
            if (!this.start) {
                this.firstClicked(x, y);
                this.start = true;
            }
            Vue.set(this.isOpened[y], x, true);
            if (this.Gamemap[y][x]) {
                this.over = true;
                this.start = false;
                console.log("over");
                 this.gameOver();
                 return;
            }
            if (this.NumberOnGamemap[y][x] === 0) {
                this.clearZeroGridAround(x, y);
            }
            if(this.checkWin()){
                this.win();
            }
        },
        gridRightClicked(x, y) {
            if (this.over){
                return;
            }
            if (!this.isOpened[y][x] && !this.over)
                Vue.set(this.isFlaged[y], x, !this.isFlaged[y][x]);
        },
        firstClicked(firstClickedX, firstClickedY) {
            let MinePosition = [];
            for (let i = 0; i < this.Mines; i++) {
                let x = randomInt(0, this.GamemapX - 1);
                let y = randomInt(0, this.GamemapY - 1);
                while (
                    MinePosition.some(mine => mine.x === x && mine.y === y) ||
                    (x === firstClickedX && y === firstClickedY)
                ) {
                    x = randomInt(0, this.GamemapX - 1);
                    y = randomInt(0, this.GamemapY - 1);
                }
                MinePosition.push({ x, y });
            }

       
            MinePosition.map(mine => {
                try {
                    Vue.set(this.Gamemap[mine.y],mine.x,true);
                } catch (e) {
                    console.log(mine);
                }
            });
       
            this.calculateNumbers();
        },
        clearZeroGridAround(x, y) {
            let clear = (currentX, currentY) => {
                if (!this.isOpened[currentY][currentX]) {
                    Vue.set(this.isOpened[currentY], currentX, true);
                    if (this.NumberOnGamemap[currentY][currentX] === 0) {
                        this.clearZeroGridAround(currentX, currentY);
                    }
                }
            };

            if(y-1>=0&&x-1>=0)
                clear(x-1,y-1);
            if(x-1>=0)
                clear(x-1,y);
            if(y+1<this.GamemapY&&x-1>=0)
                clear(x-1,y+1);
            if(y-1>=0)
                clear(x,y-1);
            if(y+1<this.GamemapY)
                clear(x,y+1);
            if(y-1>=0&&x+1<this.GamemapX)
                clear(x+1,y-1);
            if(x+1<this.GamemapX)
                clear(x+1,y);
            if(y+1<this.GamemapY&&x+1<this.GamemapX)
                clear(x+1,y+1)

          
        },
        calculateNumbers() {
            for (let x = 0; x< this.GamemapX; x++) {
                for (let y = 0; y < this.GamemapY; y++) {
                    if (this.Gamemap[y][x]) {
                        continue;
                    }
                    let count = 0;
                        if(x-1>=0&&y-1>=0&&this.Gamemap[y-1][x-1]) count++;
                        if(x-1>=0&&this.Gamemap[y][x-1]) count++;
                        if(x-1>=0&&y+1<this.GamemapY&&this.Gamemap[y+1][x-1]) count++;
                        if(y-1>=0&&this.Gamemap[y-1][x]) count++;
                        if(y+1<this.GamemapY&&this.Gamemap[y+1][x]) count++;
                        if(x+1<this.GamemapX&&y-1>=0&&this.Gamemap[y-1][x+1]) count++;
                        if(x+1<this.GamemapX&&this.Gamemap[y][x+1]) count++;
                        if(x+1<this.GamemapX&&y+1<this.GamemapY&&this.Gamemap[y+1][x+1]) count++;
                        
                    
                    Vue.set(this.NumberOnGamemap[y], x, count);
                }
            }
        },
        checkWin(){
            for(let y=0;y<this.Gamemap.length;y++){
                for(let x=0;x<this.Gamemap[0].length;x++){
                    if(!this.isOpened[y][x]&&!this.Gamemap[y][x]){
                        // alert("false"+" "+y+" "+x+this.isOpened[y][x]+" "+this.Gamemap[y][x])
                        return false;
                    }
                }
            }

            return true;
        }
    }
};
</script>

<style></style>
