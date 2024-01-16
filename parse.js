const e = require('express');
const { platform } = require('os');
const readXlsxFile = require('read-excel-file/node')
function isOdd(num) { 
    zeroOrOne = num % 2;
    if(zeroOrOne === 1){
        return true
    }
    if(zeroOrOne === 0){
        return false
    }

}
function springColsToPeriods(springCol){
    if(springCol === 7){
        return 1
    }else if(springCol === 8){
        return 2
    }else if(springCol === 9){
        return 3
    }else if(springCol === 10){
        return 4
    }
}
readXlsxFile('./schedule.xlsx', {sheet:1}).then((rows)=>{
    var classes = []
    var teacherCol = 5;
    var fallCols = [1,2,3,4]
    var springCols = [7,8,9,10]
    var combinedFirstSecondList = []
    var classesCleaned = [{className:"Placeholder", classes:[{period: 1, startQuarter: 1, endQuarter:1}]}]

    for (let index = 0; index < rows.length; index++) {
        if(isOdd(index)){
           var combined = [rows[index-1], rows[index]];
           combinedFirstSecondList.push(combined);
        }else{
            continue
        }
    }
    console.log("Row pairs combined")
    for (let index = 0; index < combinedFirstSecondList.length; index++) {
        for (let i = 0; i < fallCols.length; i++) {
            if(combinedFirstSecondList[index][0][fallCols[i]] != null){
                //Check first quarter
                if(combinedFirstSecondList[index][1][fallCols[i]] === null){
                    classes.push({className: combinedFirstSecondList[index][0][fallCols[i]], endQuarter: 2, startQuarter:1 ,period:fallCols[i]})
                }else{
                    classes.push({className: combinedFirstSecondList[index][0][fallCols[i]], endQuarter: 1, startQuarter: 1,period:fallCols[i]})
                    classes.push({className: combinedFirstSecondList[index][1][fallCols[i]], endQuarter: 2, startQuarte:2, period:fallCols[i]})

                }
            }else{
                if(combinedFirstSecondList[index][1][fallCols[i]] != null){
                    classes.push({className: combinedFirstSecondList[index][1][fallCols[i]], endQuarter: 2, startQuarte:2, period:fallCols[i]})
                }
            }
        }
        for (let i = 0; i < springCols.length; i++) {
            if(combinedFirstSecondList[index][0][springCols[i]] != null){
                //Check first quarter
                if(combinedFirstSecondList[index][1][springCols[i]] === null){
                    classes.push({className: combinedFirstSecondList[index][0][springCols[i]], endQuarter: 4, startQuarter:3 ,period:springColsToPeriods(springCols[i])})
                }else{
                    classes.push({className: combinedFirstSecondList[index][0][springCols[i]], endQuarter: 3, startQuarter: 3,period:springColsToPeriods(springCols[i])})
                    classes.push({className: combinedFirstSecondList[index][1][springCols[i]], endQuarter: 4, startQuarter:4, period:springColsToPeriods(springCols[i])})

                }
            }else{
                if(combinedFirstSecondList[index][1][springCols[i]] != null){
                    classes.push({className: combinedFirstSecondList[index][1][springCols[i]], endQuarter: 4, startQuarter:4, period:springColsToPeriods(springCols[i])})
                }
            }
        }
        
    }
for (let index = 0; index < classes.length; index++) {
    const element = classes[index];
    console.log(element)
    if(classesCleaned.some(item => item.className === element.className)){
        var obj = classesCleaned.filter(item => item.className === element.className);
        console.log(obj[0])
        var place = classesCleaned.indexOf(obj[0])
        classesCleaned[place].classes.push({period: element.period, startQuarter: element.startQuarter, endQuarter:element.endQuarter});
    
    }else{
        classesCleaned.push({className:element.className, classes:[{period: element.period, startQuarter: element.startQuarter, endQuarter:element.endQuarter}]})
    }
    /**for (let i = 0; i < classesCleaned.length; i++) {
        const e = classesCleaned[i];
        if(e.className === element.className){
            e.classes.push({period: element.period, startQuarter: element.startQuarter, endQuarter:element.endQuarter});
        }else{
            classesCleaned.push({className:element.className, classes:[{period: element.period, startQuarter: element.startQuarter, endQuarter:element.endQuarter}]})
        }
        
    }*/
} 
classesCleaned.shift()
var classesJson = {classes:classesCleaned}
var classesStringifyJson = JSON.stringify(classesJson);
var fs = require('fs');
fs.writeFile('classes.json', classesStringifyJson, 'utf8', function(errrr){
    console.error(errrr)
});
})
