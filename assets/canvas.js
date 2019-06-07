const canvas = document.querySelector('#draw');
const ctx = canvas.getContext('2d');  // 取得 Canvas 的渲染環境及其繪圖函數

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize
ctx.strokeStyle = '#bada55';  // 筆觸顏色
ctx.lineJoin = 'round';  // 兩條線交匯處產生 "圓形" 邊角
ctx.lineCap = 'round';  // 筆觸預設為 "圓形"
ctx.lineWidth = 1;  // 筆頭寬度

let isDrawing = false;  // 是否允許繪製  (或說是否是 mousedown 下筆狀態)

/* 繪製時的起點座標 */
let lastX = 0;
let lastY = 0;

/*========== Events Binding ==========*/
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true; // 允許繪製
    [lastX, lastY] = [e.offsetX, e.offsetY]; // 設定起始點
});

canvas.addEventListener('mousemove', draw);

/*========== 繪製函數；在 mousemove 的時候使用 ==========*/
function draw(e) {
    if(!isDrawing) return;  // 沒有允許繪製即退出

    /* 繪製路線 Setting */
    ctx.beginPath();  // 開始路徑 or Reset
    ctx.moveTo(lastX, lastY);  // 設定起點
    ctx.lineTo(e.offsetX, e.offsetY);  // 設定終點
    ctx.stroke();  // 依照設定開始繪製

    [lastX, lastY] = [e.offsetX, e.offsetY];  // 位置更新

    // 自動變色功能
    // rainbow();
    // 自動粗細變化功能
    // telescopicWidth();
}

if(!isDrawing) return;

/*---------- Rainbow 功能 ----------*/
let hue = 0; // 色相環度數從 0 開始 (的異世界!? XD)

function rainbow(){
    // 透過 context 的 strokeStyle 設定筆畫顏色
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;

    hue++; // 色相環 度數更新
    if (hue >= 360) {
        hue = 0;
    }
}

/*---------- 動態筆觸 功能 ----------*/
/**
 * for 筆觸大小。
 *
 * true 為 "細到粗"
 * false 為"粗到細"
 */
let direction = true;

function telescopicWidth(){
    /* 如果 >=100 或者 <=1 則筆觸大小反向動作 */
    if (ctx.lineWidth >= 100 || ctx.lineWidth <= 1) {
        direction = !direction;
    }

    /* 筆觸粗細實作 */
    if (direction) {
        ctx.lineWidth++;
    } else {
        ctx.lineWidth--;
    }
}
