(async () => {
    const app = new PIXI.Application();
    await app.init({resizeTo: x => window, width: 2560, height: 1440});
    document.body.appendChild(app.canvas);

    await PIXI.Assets.load([
        Icon7 = "../images/Icon7.png",
        IconStar = "../images/IconStar.png",
        IconA = "../images/IconA.png",
        IconK = "../images/IconK.png",
        IconQ = "../images/IconQ.png",
        IconJ = "../images/IconJ.png",
        Icon10 = "../images/Icon10.png",
        frame = "../images/frame.png",
        Background = "../images/Background.png",
        Rule1="../images/Rule1.png",
        Rule2="../images/Rule2.png",
        TopBackground="../images/TopBackground.gif",
    ]);

    //設置背景
    const backgroundTexture = PIXI.Texture.from(Background);
    const backgroundSprite = new PIXI.Sprite(backgroundTexture);
    backgroundSprite.width = app.screen.width; 
    backgroundSprite.height = app.screen.height;
    app.stage.addChild(backgroundSprite);
    app.stage.setChildIndex(backgroundSprite, 0);

    window.addEventListener('resize', () => {
        backgroundSprite.width = app.screen.width;
        backgroundSprite.height = app.screen.height;
    });
    //設置音效
    const spinSound = new Howl({
        src: ['../Sound/SpinSound.wav'], // 替換為你的音效文件路徑
        volume: 0.5, // 設置音量
    });
    const winSound = new Howl({
        src: ['../Sound/WinSound.wav'], // 替換為你的音效文件路徑
        volume: 0.5, // 設置音量
    });
    const spinStopSound = new Howl({
        src: ['../Sound/StopSound.wav'], // 替換為你的音效文件路徑
        volume: 0.5, // 設置音量
    });
    const SpinButtonSound = new Howl({
        src: ['../Sound/SpinButtonSound.wav'], // 替換為你的音效文件路徑
        volume: 0.5, // 設置音量
    });
    const betButtonSound = new Howl({
        src: ['../Sound/BetButtonSound.wav'], // 替換為你的音效文件路徑
        volume: 0.5, // 設置音量
    });

    //預設長寬變數
    const REEL_WIDTH = 250;
    const SYMBOL_SIZE = 250;

    //輪盤圖案
    const slotTextures = [
        PIXI.Texture.from(Icon7),
        PIXI.Texture.from(IconStar),
        PIXI.Texture.from(IconA),
        PIXI.Texture.from(IconK),
        PIXI.Texture.from(IconQ),
        PIXI.Texture.from(IconJ),
        PIXI.Texture.from(Icon10),
    ];

    //設置初始陣列,將符號隨機進陣列中
    const reels = [];
    const smb_nmber = [];
    const reelContainer = new PIXI.Container();

    for (let i = 0; i < 5; i++) {
        const rc = new PIXI.Container();
        rc.x = i * REEL_WIDTH;
        reelContainer.addChild(rc);
        const reel_number = []
        const reel = {
            container: rc,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new PIXI.BlurFilter(),
        };

        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        rc.filters = [reel.blur];

        for (let j = 0; j < 4; j++) {
            const slot_number = Math.floor(Math.random() * slotTextures.length);
            const symbol = new PIXI.Sprite(slotTextures[slot_number]);
            symbol.y = j * SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width)/2);
            reel.symbols.push(symbol);
            reel_number.push(slot_number)
            rc.addChild(symbol);
        }
        smb_nmber.push(reel_number);
        reels.push(reel);
    }
    app.stage.addChild(reelContainer);
    app.stage.setChildIndex(reelContainer,1);
    const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
    reelContainer.y = margin;
    reelContainer.x = app.stage.width /2-520;
    //拉霸機測試外框
    const frameTexture = new PIXI.Sprite(PIXI.Texture.from(frame));
    frameTexture.x = reelContainer.x-82 ;
    frameTexture.y = reelContainer.y-82 ;
    app.stage.addChild(frameTexture);
    app.stage.setChildIndex(frameTexture,1);
    // window.addEventListener('resize', () => {
    //     frameTexture.x= reelContainer.x;
    //     frameTexture.y= reelContainer.y;
    // });
    


    const Rule1Texture = new PIXI.Sprite(PIXI.Texture.from(Rule1));
    Rule1Texture.x = reelContainer.x-680;
    Rule1Texture.y = reelContainer.y-200;
    Rule1Texture.width =  600;
    Rule1Texture.height = 400;
    app.stage.addChild(Rule1Texture);
    app.stage.setChildIndex(Rule1Texture,1);

    const Rule2Texture = new PIXI.Sprite(PIXI.Texture.from(Rule2));
    Rule2Texture.x = reelContainer.x-680;
    Rule2Texture.y = reelContainer.y+300;
    Rule2Texture.width =  600;
    Rule2Texture.height = 400;
    app.stage.addChild(Rule2Texture);
    app.stage.setChildIndex(Rule2Texture,1);


    //置頂跟置底的按鈕區間樣式
    const top = new PIXI.Graphics().roundRect(reelContainer.x-25, reelContainer.y-265, 1300,250,50).fill({ color: 0xEE7CFF })
    const bottom = new PIXI.Graphics().roundRect(reelContainer.x-100,reelContainer.y+780,1450,250,60).fill({ color: 0xEE7CFF });
    const FrameOut = new PIXI.Graphics().roundRect(reelContainer.x-20, reelContainer.y-20, 1290, 790).stroke({ width: 40, color: 0xEE7CFF});
    const SpinButton = new PIXI.Graphics().roundRect(reelContainer.x+900,reelContainer.y+800,400,200,30).fill({ color: 0x00CACA }).stroke({ width: 10, color: 0x0072E3 });
    const bet = new PIXI.Graphics().roundRect(reelContainer.x-50,reelContainer.y+800,400,200,30).fill({ color: 0x00CACA }).stroke({ width: 10, color: 0x0072E3 });
    const betPlus = new PIXI.Graphics().roundRect(reelContainer.x+280,reelContainer.y+825,50,150,5).fill({ color: 0x004B97 }).stroke({ width: 10, color: 0x0072E3 });
    const betMinus = new PIXI.Graphics().roundRect(reelContainer.x-30,reelContainer.y+825,50,150,5).fill({ color: 0x004B97 }).stroke({ width: 10, color: 0x0072E3 });
    //畫中獎線

    const LineMargin = 10;
    const Line1 = new PIXI.Graphics().moveTo(reelContainer.x,reelContainer.y+125).lineTo(reelContainer.x+1250,reelContainer.y+125).stroke({ width: 10, color: 0xEA0000 });
    const Line2 = new PIXI.Graphics().moveTo(reelContainer.x,reelContainer.y+375).lineTo(reelContainer.x+1250,reelContainer.y+375).stroke({ width: 10, color: 0xFF359A });
    const Line3 = new PIXI.Graphics().moveTo(reelContainer.x,reelContainer.y+625).lineTo(reelContainer.x+1250,reelContainer.y+625).stroke({ width: 10, color: 0xFF00FF });
    const Line4 = new PIXI.Graphics().moveTo(reelContainer.x,reelContainer.y+125).lineTo(reelContainer.x+125,reelContainer.y+125).
    lineTo(reelContainer.x+625,reelContainer.y+625).lineTo(reelContainer.x+1125,reelContainer.y+125).lineTo(reelContainer.x+1250,reelContainer.y+125).stroke({ width: 10, color: 0x9F35FF });

    const Line5 = new PIXI.Graphics().moveTo(reelContainer.x,reelContainer.y+625).lineTo(reelContainer.x+125,reelContainer.y+625).
    lineTo(reelContainer.x+625,reelContainer.y+125).lineTo(reelContainer.x+1125,reelContainer.y+625).lineTo(reelContainer.x+1250,reelContainer.y+625).stroke({ width: 10, color: 0x2828FF });

    const Line6 = new PIXI.Graphics().moveTo(reelContainer.x,reelContainer.y+125).lineTo(reelContainer.x+375,reelContainer.y+125).
    lineTo(reelContainer.x+875,reelContainer.y+625).lineTo(reelContainer.x+1250,reelContainer.y+625).stroke({ width: 10, color: 0x0072E3 });

    const Line7 = new PIXI.Graphics().moveTo(reelContainer.x,reelContainer.y+625).lineTo(reelContainer.x+375,reelContainer.y+625).
    lineTo(reelContainer.x+875,reelContainer.y+125).lineTo(reelContainer.x+1250,reelContainer.y+125).stroke({ width: 10, color: 0x00CACA });

    const Line8 = new PIXI.Graphics().moveTo(reelContainer.x,reelContainer.y+375).lineTo(reelContainer.x+125,reelContainer.y+375).
    lineTo(reelContainer.x+375,reelContainer.y+125).lineTo(reelContainer.x+875,reelContainer.y+625).lineTo(reelContainer.x+1125,reelContainer.y+375).
    lineTo(reelContainer.x+1250,reelContainer.y+375).stroke({ width: 10, color: 0x02DF82 });
    
    const Line9 = new PIXI.Graphics().moveTo(reelContainer.x,reelContainer.y+375).lineTo(reelContainer.x+125,reelContainer.y+375).
    lineTo(reelContainer.x+375,reelContainer.y+625).lineTo(reelContainer.x+875,reelContainer.y+125).lineTo(reelContainer.x+1125,reelContainer.y+375).
    lineTo(reelContainer.x+1250,reelContainer.y+375).stroke({ width: 10, color: 0x00DB00 });


    const fill = new PIXI.FillGradient(0, 0, 0, 36 * 1.7);
    const colors = [0x00CACA, 0x00ff99].map((color) => PIXI.Color.shared.setValue(color).toNumber());
    colors.forEach((number, index) => {
        const ratio = index / colors.length;
        fill.addColorStop(ratio, number);
    });
    const AllLine = [Line1,Line2,Line3,Line4,Line5,Line6,Line7,Line8,Line9];

    app.stage.addChild(top);
    app.stage.addChild(bottom);
    app.stage.addChild(FrameOut);
    app.stage.addChild(SpinButton);
    app.stage.addChild(bet);
    bet.addChild(betPlus);
    bet.addChild(betMinus);
    for (let i = 0; i < AllLine.length; i++) {
        app.stage.addChild(AllLine[i]);
        AllLine[i].alpha=0;
    }

    //字形設計
    const style = new PIXI.TextStyle({
        fontFamily: 'sans-serif',
        fontSize: 85,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fill: { color: 0x8CEA00 },
        stroke: { color: 0x0072E3, width: 5 },
        dropShadow: {
            color: 0xB7FF4A,
            blur: 5,
        },
        wordWrap: true,
        wordWrapWidth: 440,
    });
    const betstyle = new PIXI.TextStyle({
        fontFamily: 'sans-serif',
        fontSize: 60,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fill: { color: 0x8CEA00 },
        stroke: { color: 0x0072E3, width: 5 },
        wordWrap: true,
        wordWrapWidth: 440,
    });
    const betpricestyle = new PIXI.TextStyle({
        fontFamily: 'monospace',
        fontSize: 60,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fill: { color: 0xFFD306 },
        stroke: { color: 0xFFFF37, width: 5 },
        align: 'right',
        wordWrap: true,
        wordWrapWidth: 440,
    });
    let betPriceCount = [900,4500,90000,450000,900000];
    const playText = new PIXI.Text('Spin!', style);
    playText.x = reelContainer.x+990;
    playText.y = reelContainer.y+850;
    SpinButton.addChild(playText);
    const betButPlus = new PIXI.Text('+', betstyle);
    betButPlus.x = reelContainer.x+284;
    betButPlus.y = reelContainer.y+865;
    betPlus.addChild(betButPlus);
    const betbutmis = new PIXI.Text('-', betstyle);
    betbutmis.x = reelContainer.x-20;
    betbutmis.y = reelContainer.y+860;
    betMinus.addChild(betbutmis);
    const betPrice = new PIXI.Text(`${betPriceCount[4]}`, betpricestyle);
    betPrice.x = reelContainer.x+90;
    betPrice.y = reelContainer.y+860;
    bet.addChild(betPrice);
    betPrice.scale.x = 0.8;   
    // 玩家金錢
    const scoreStyle = new PIXI.TextStyle({
        fontFamily: 'monospace',
        fontSize: 80,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: { color: 0xFFD306 },
    });

    //中獎金額字體位置
    let winPrice = 0;
    const winPriceTeg = new PIXI.Text('Win Price!', scoreStyle);
    winPriceTeg.x = reelContainer.x+420;
    winPriceTeg.y = reelContainer.y+800;
    app.stage.addChild(winPriceTeg);
    const winPriceShow = new PIXI.Text(`${winPrice}`, scoreStyle);
    winPriceShow.x = reelContainer.x+480;
    winPriceShow.y = reelContainer.y+880;
    app.stage.addChild(winPriceShow);
    

    //金錢字體位置
    let score = 500000;
    const scoreText = new PIXI.Text(`Player Money: ${score}`, scoreStyle);
    scoreText.x = reelContainer.x+100;
    scoreText.y = reelContainer.y-200;
    app.stage.addChild(scoreText);
    //設置evenlistener
    SpinButton.eventMode = 'static';
    SpinButton.cursor = 'pointer';
    SpinButton.addListener('pointerdown', () => {
        betButtonSound.play();
        startPlay();
    });
    betbutmis.eventMode = 'static';
    betbutmis.cursor = 'pointer';
    betButPlus.eventMode = 'static';
    betButPlus.cursor = 'pointer';
    betButPlus.addEventListener('pointerdown', () => {
        betButtonSound.play();
        if (betPriceCount.indexOf(parseInt(betPrice.text)) < 4 ){
            betPrice.text = `${betPriceCount[betPriceCount.indexOf(parseInt(betPrice.text))+1]}`;
        }else{
            betPrice.text = `${betPriceCount[0]}`;
        }
    });
    betbutmis.addEventListener('pointerdown', () => {
        betButtonSound.play();
        if (betPriceCount.indexOf(parseInt(betPrice.text)) > 0 ){
            betPrice.text = `${betPriceCount[betPriceCount.indexOf(parseInt(betPrice.text))-1]}`;
        }else{
            betPrice.text = `${betPriceCount[4]}`;
        }
    });
    let running = false;


    //開始遊戲函數
    function startPlay() {
        
        if (parseInt(betPrice.text) > score){
            alert('金錢不足');
            return;
        }else {
            if (running) return;
            spinSound.play();
            score=score-parseInt(betPrice.text);
            updateScore();
            running = true;
            for (let i = 0; i < AllLine.length; i++) {
                AllLine[i].alpha=0;
            }
            for (let i = 0; i < reels.length; i++) {
                const r = reels[i];
                const extra = Math.floor(Math.random() * 3);
                const target = r.position + 10 + i * 5 + extra;
                const time = 2800 + i * 500 ;
                // const time = 2500 + i * 600 + extra * 600;
                tweenTo(r, 'position', target, time, backout(0.7), null, i === reels.length - 1 ? reelsComplete : null);
            }
        }
    }
    //設定連線
    const winLines1 = [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3}, {x: 1, y: 4}];
    const winLines2 = [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3}, {x: 2, y: 4}];
    const winLines3 = [{x: 3, y: 0}, {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 3}, {x: 3, y: 4}];
    const winLines4 = [{x: 1, y: 0}, {x: 2, y: 1}, {x: 3, y: 2}, {x: 2, y: 3}, {x: 1, y: 4}];
    const winLines5 = [{x: 3, y: 0}, {x: 2, y: 1}, {x: 1, y: 2}, {x: 2, y: 3}, {x: 3, y: 4}];
    const winLines6 = [{x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}, {x: 3, y: 4}];
    const winLines7 = [{x: 3, y: 0}, {x: 3, y: 1}, {x: 2, y: 2}, {x: 1, y: 3}, {x: 1, y: 4}];
    const winLines8 = [{x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}, {x: 2, y: 4}];
    const winLines9 = [{x: 2, y: 0}, {x: 3, y: 1}, {x: 2, y: 2}, {x: 1, y: 3}, {x: 2, y: 4}];
    let LineCounter = [];

    function checkWinLines(results) {
        const winLines = [winLines1, winLines2, winLines3, winLines4, winLines5, winLines6, winLines7, winLines8, winLines9];
        let Linenumber = 0; // 計算總的贏線數量
        

        winLines.forEach(line => {
            let firstSymbol = results[line[0].x][line[0].y];// 以每條線的第一個符號作為參照
            let matchCount = 1; // 初始匹配數量為1
            Linenumber++;
            updateWinPrice();
    
            // 判定該線上的符號
            for (let i = 1; i < line.length; i++) {
                const symbol = results[line[i].x][line[i].y];
                if (symbol === firstSymbol || symbol === 1) {
                    matchCount++;
                }else if (firstSymbol === 1 && i < line.length-1) {
                    firstSymbol = symbol;
                    matchCount++;
                }else{
                    break; // 一旦不匹配，停止檢查該線
                }
            }
            for (let i = 0; i < line.length; i++) {
                const symbol = results[line[i].x][line[i].y];
                if (symbol === 1) {

                }
            }
            
    
            // 如果有3個或更多匹配的符號，則計算為贏線
            if (matchCount == 3) {
                console.log(`符號代碼: ${firstSymbol}, 匹配數量: ${matchCount}`);
                LineCounter.push(Linenumber);
                if (firstSymbol == 0){
                    winPrice += (parseInt(betPrice.text)/9)*30;
                }else if (firstSymbol == 1 ){
                    winPrice += (parseInt(betPrice.text)/9)*15;
                }else if (firstSymbol == 2){
                    winPrice += (parseInt(betPrice.text)/9)*15;
                }else if (firstSymbol == 3){
                    winPrice += (parseInt(betPrice.text)/9)*4;
                }else {
                    winPrice += (parseInt(betPrice.text)/9)*2;
                }
            }else if (matchCount == 4) {
                console.log(`符號代碼: ${firstSymbol}, 匹配數量: ${matchCount}`);
                LineCounter.push(Linenumber);
                if (firstSymbol == 0){
                    winPrice += (parseInt(betPrice.text)/9)*150;
                }else if (firstSymbol == 1 ){
                    winPrice += (parseInt(betPrice.text)/9)*50;
                }else if (firstSymbol == 2){
                    winPrice += (parseInt(betPrice.text)/9)*35;
                }else if (firstSymbol == 3){
                    winPrice += (parseInt(betPrice.text)/9)*20;
                }else {
                    winPrice += (parseInt(betPrice.text)/9)*15;
                }
            }else if (matchCount == 5) {
                console.log(`符號代碼: ${firstSymbol}, 匹配數量: ${matchCount}`);
                LineCounter.push(Linenumber);
                if (firstSymbol == 0){
                    winPrice += (parseInt(betPrice.text)/9)*1500;
                }else if (firstSymbol == 1 ){
                    winPrice += (parseInt(betPrice.text)/9)*500;
                }else if (firstSymbol == 2){
                    winPrice += (parseInt(betPrice.text)/9)*150;
                }else if (firstSymbol == 3){
                    winPrice += (parseInt(betPrice.text)/9)*50;
                }else {
                    winPrice += (parseInt(betPrice.text)/9)*35;
                }
            }
        });
    
        if (LineCounter.length > 0) {
            winSound.play();
            console.log(`總共獲勝線數量: ${LineCounter.length}`);
            console.log(`總共獲勝金額: ${winPrice}`);
            score += winPrice;
            updateWinPrice();
            winPrice = 0;
        }
    }

    // 拉霸轉完設置成結束
    function reelsComplete() {
        running = false;
        create_result();
        checkWinLines(results);
        updateScore();
        results = Array.from({ length: 4 }, () => []);
        spinSound.stop();
    };
    
    // 創建一個 4x5 的二維陣列 儲存輪盤的數值
    let results = Array.from({ length: 4 }, () => []);
    // 創建結果
    function create_result() {
        // 遍歷每個 reel
        for (let reelIndex = 0; reelIndex < reels.length; reelIndex++) {
            const reel = reels[reelIndex];
    
            // 遍歷每個 symbol
            for (let symbolIndex = 0; symbolIndex < reel.symbols.length; symbolIndex++) {
                const symbol = reel.symbols[symbolIndex];
    
                // 找到 symbol 的 texture 在 slotTextures 中的索引
                const textureIndex = slotTextures.indexOf(symbol.texture);
    
                // 根據 position 計算出二維陣列中的位置
                let x = reelIndex;
                let y = (Math.floor(symbol.y / SYMBOL_SIZE) + 1) % 4; // y 值 + 1，並取模以確保在 [0, 3] 範圍內
    
                // 使用 push 將 textureIndex 添加到對應 y 行的陣列中
                results[y].push(textureIndex);
    
                // 輸出調試信息（可選）
                console.log(`Symbol at Reel ${reelIndex}, Slot ${symbolIndex}: Texture Index = ${textureIndex}, Position = [${y}, ${x}]`);
            }
        }
    
        // 輸出整個結果陣列
        console.log('Final 4x5 Results:', results);
    
    }

    //更新金錢
    function updateScore() {
        scoreText.text = `Player Money: ${score}`;
    }
    function updateWinPrice() {
        winPriceShow.text = `${winPrice}`;
    }

    //更新畫面
    app.ticker.add(() => {
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;
            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                const prevy = s.y;
                s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                if (s.y < 0 && prevy > SYMBOL_SIZE) {
                    // const slot_number = 0;
                    const slot_number = Math.floor(Math.random() * slotTextures.length);
                    s.texture = slotTextures[Math.floor(slot_number)];
                    s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                    s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                }
            }
        }
    });

    const tweening = [];

    function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
        const tween = {
            object,
            property,
            propertyBeginValue: object[property],
            target,
            easing,
            time,
            change: onchange,
            complete: oncomplete,
            start: Date.now(),
        };

        tweening.push(tween);

        return tween;
    }

    app.ticker.add(() => {
        const now = Date.now();
        const remove = [];

        for (let i = 0; i < tweening.length; i++) {
            const t = tweening[i];
            const phase = Math.min(1, (now - t.start) / t.time);

            t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
            if (t.change) t.change(t);
            if (phase === 1) {
                t.object[t.property] = t.target;
                if (t.complete) t.complete(t);
                remove.push(t);
            }
        }
        for (let i = 0; i < remove.length; i++) {
            tweening.splice(tweening.indexOf(remove[i]), 1);
            spinStopSound.play();
            
        }
    });

    function lerp(a1, a2, t) {
        return a1 * (1 - t) + a2 * t;
    }

    function backout(amount) {
        return (t) => --t * t * ((amount + 1) * t + amount) + 1;
    }
    let timeri = 0;
    let fadein = true;
    let fadeout = false;

    //設置線段閃爍
    app.ticker.add(() => {
        if (running == true){
            LineCounter=[];
        }
        if(running == false){
            if (fadein){
                for (let i = 0; i < LineCounter.length; i++) {
                    AllLine[LineCounter[i]-1].alpha=0;
                }
                timeri+=0.02;
                if (timeri>=1){
                    fadein = false;
                    fadeout = true;
                }
            }
            if (fadeout){
                for (let i = 0; i < LineCounter.length; i++) {
                    AllLine[LineCounter[i]-1].alpha=1;
                }
                timeri-=0.02;
                if (timeri<=0){
                    fadein = true;
                    fadeout = false;
                }
            }
        }
    });
})();