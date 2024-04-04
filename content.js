setTimeout(function() {
    console.log("table get");
    console.log(getCurrentTime());
    const targetDate = getTargetDate();

    const table = document.querySelector('table');

    // row=1, because 0th row is headings
    for(let row=1 ; row<table.rows.length ; row++){
        const dateRow = table.rows[row];
        // find today's row
        if(dateRow.cells[0].textContent.trim() === targetDate){
            console.log('matched');
            const date = dateRow.cells[0];
            const inTimes = dateRow.cells[1];
            const outTimes = dateRow.cells[2];
            const durations = dateRow.cells[3];
            const gameZones = dateRow.cells[4];
            const total = dateRow.cells[5];

            const newOutTime = getCurrentTime();

            const sampleOutTimeDiv = createNewDiv('sampleOutTime', newOutTime);
            outTimes.lastChild.appendChild(sampleOutTimeDiv);

            const lastInTimeSpan = inTimes.lastChild.lastChild.lastChild;
            const lastInTime = lastInTimeSpan.textContent.trim();
            console.log("Last time : "+lastInTime);

            const newDuration = subtractDates(newOutTime,lastInTime);
            console.log("Curr in time : "+newDuration);

            const sampleDurationTimeDiv = createNewDiv('sampleDurationTime', newDuration);
            durations.lastChild.appendChild(sampleDurationTimeDiv);

            const currTotal = total.lastChild.lastChild.lastChild.textContent;
            console.log("Curr total time : "+currTotal);
            
            
            const newTotal = addDates(currTotal, newDuration);
            console.log("New total : "+newTotal);
            
            const totalDivTag = total.lastChild.lastChild;
            const totalSpanTag = totalDivTag.lastChild;
            totalSpanTag.id = 'totalTimeEntry';
            totalSpanTag.textContent = newTotal;

            updateColor(newTotal,totalDivTag);

            setInterval(updateTimeEachSecond, 1000);
        }
    }

}, 5000);

function getTargetDate(){
    const today = new Date();

    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
}

function getCurrentTime(){
    const now = new Date();

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const currentTime = `${hours}:${minutes}:${seconds}`;
    return currentTime;
}

function subtractDates(date1Str, date2Str){
    const date1 = getDateFromString(date1Str);
    const date2 = getDateFromString(date2Str);

    const differenceInSeconds = Math.floor((date1.getTime() - date2.getTime())/1000);
    
    return getDateFromSeconds(differenceInSeconds);
}

function addDates(date1Str, date2Str){
    const [hours1, minutes1, seconds1] = date1Str.split(':').map(Number);
    const [hours2, minutes2, seconds2] = date2Str.split(':').map(Number);

    let totalSeconds = seconds1 + seconds2;
    let carryMinutes = Math.floor(totalSeconds / 60);
    totalSeconds %= 60;

    let totalMinutes = minutes1 + minutes2 + carryMinutes;
    let carryHours = Math.floor(totalMinutes / 60);
    totalMinutes %= 60;

    const totalHours = hours1 + hours2 + carryHours;

    const formattedHours = String(totalHours).padStart(2, '0');
    const formattedMinutes = String(totalMinutes).padStart(2, '0');
    const formattedSeconds = String(totalSeconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function getDateFromString(dateStr){
    const dateParts = dateStr.split(':');
    const date = new Date();
    date.setHours(parseInt(dateParts[0], 10));
    date.setMinutes(parseInt(dateParts[1], 10));
    date.setSeconds(parseInt(dateParts[2], 10));
    return date;
}

function getDateFromSeconds(dateInSeconds){
    const seconds = dateInSeconds % 60;
    const minutes = Math.floor(dateInSeconds / (60)) % 60;
    const hours = Math.floor(dateInSeconds / (60 * 60));

    const differenceInDateFormat = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return differenceInDateFormat;
}

function updateTimeEachSecond(){
    const outTimeSpanTag = document.getElementById('sampleOutTime');
    incrementSecondOfGivenTag(outTimeSpanTag);
    const durationTimeSpanTag = document.getElementById('sampleDurationTime');
    incrementSecondOfGivenTag(durationTimeSpanTag);
    const totalTimeSpanTag = document.getElementById('totalTimeEntry');
    incrementSecondOfGivenTag(totalTimeSpanTag);
    updateColor(totalTimeSpanTag.textContent, totalTimeSpanTag.parentElement);
}

function incrementSecondOfGivenTag(tag){
    const time = tag.textContent;
    
    const date = getDateFromString(time);
    date.setTime(date.getTime() + 1000);

    tag.textContent = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

function createNewDiv(className, time){
    const newDiv = document.createElement('div');
    const nestedDiv = document.createElement('div');
    nestedDiv.className = 'w-[80px] rounded-md globalTable-Badge-root';
    // nestedDiv.style.setProperty('background', 'rgba(77,171,247,0.15)');
    nestedDiv.style.setProperty('background', 'rgba(7,188,12,0.15)');
    nestedDiv.style.setProperty('display', 'flex');
    nestedDiv.style.setProperty('justify-content', 'center');

    const spanElement = document.createElement('span');
    nestedDiv.appendChild(spanElement);
    spanElement.id = className;
    spanElement.className = 'globalTable-Badge-label';
    spanElement.style = 'position: relative; font-weight: 600; text-transform: capitalize; font-size: 12px;';
    spanElement.style.setProperty('color', '#07bc07');
    spanElement.textContent = time;

    
    newDiv.appendChild(nestedDiv);

    return newDiv;
}

function validateTimeCompleted(dateInStr){
    const minHours = 8;
    const minMinutes = 20;
    const [hours, minutes, seconds] = dateInStr.split(':').map(Number);
    if(hours<minHours){
        console.log('hours is less');
        return false;
    }
    if(hours>minHours){
        console.log('hours is high');
        return true;
    }
    if(minutes>=minMinutes){
        console.log('hours is same, minute high');
        return true;
    }
    console.log('same hour, minute is less');
    return false;
}

function updateColor(newTotal,totalDivTag){
    if(validateTimeCompleted(newTotal)){
        totalDivTag.style.setProperty('background','rgba(77, 171, 247, 0.15)');
        totalDivTag.style.setProperty('color','#d0ebff');
    }else{
        totalDivTag.style.setProperty('background','rgba(255, 135, 135, 0.15)');
        totalDivTag.style.setProperty('color','#ffe3e3');
    }
}



    // const firstRow = table.rows[1];

    // console.log(firstRow);

    // for(let i=0 ; i<firstRow.cells.length ; i++){
    //     const cellValue = firstRow.cells[i];
    //     console.log(cellValue);
    //     console.log(cellValue.textContent.trim());
    //     if (cellValue.textContent.trim() === targetDate) {
    //         console.log('matched');
    //     }else{
    //         console.log('not matched');
    //     }
    // }