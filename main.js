var mongo = require("mongodb");
const { get } = require("mongoose");
const mongoClient = new mongo.MongoClient("mongodb://localhost:27017/");
async function addClassesToDatabase() {
  await mongoClient.connect();
  const schedulerDB = mongoClient.db("scheduler");
  const classesCollection = schedulerDB.collection("classes");
  const result = await classesCollection.insertMany(clasess.classes);
  console.log(result);
  await mongoClient.close();
}
async function searchClasses(query) {
  await mongoClient.connect();
  const schedulerDB = mongoClient.db("scheduler");
  const classesCollection = schedulerDB.collection("classes");
  const cursor = await classesCollection.find();
  const clasess = await cursor.toArray();
  const results = clasess.filter((item) => item.className.includes(query));
  mongoClient.close();
  return results;
}
function displayFoundClasses(foundClasses) {
  for (let index = 0; index < foundClasses.length; index++) {
    const element = foundClasses[index];
    console.log(foundClasses[index].className);
  }
}
async function getClass(className) {
  await mongoClient.connect();
  const schedulerDB = mongoClient.db("scheduler");
  const classesCollection = schedulerDB.collection("classes");
  const result = await classesCollection.findOne({ className: className });
  mongoClient.close();

  return result;
}
function schedule(yearLongClasses, priorityClasses, secondaryClasses) {
  var scheduleArr = [
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ];
  class scheduleClass {
    constructor(className, classes, isYearLong) {
      this.className = className;
      this.classes = classes;
      this.yearLong = isYearLong;
    }
    seeAndSwitch() {
      if(this.yearLong === true){
        return false
      }else{
      var uhOhFlag = false;
      for (let index = 0; index < this.classes.length; index++) {
        const element = this.classes[index];
        if (
          scheduleArr[element.period - 1][element.startQuarter - 1] === "" &&
          scheduleArr[element.period - 1][element.endQuarter - 1] === ""
        ) {
          for (let x = 0; x < scheduleArr.length; x++) {
            const list = scheduleArr[x];
            var byeByeClasses = list.filter(
              (item) => item.className === this.className
            );
            for (let y = 0; y < byeByeClasses.length; y++) {
              const z = list.indexOf(byeByeClasses[y]);
              scheduleArr[x][z] = "";
            }
          }
          scheduleArr[element.period - 1][element.startQuarter - 1] = this;
          scheduleArr[element.period - 1][element.endQuarter - 1] = this;
          return true;
        } else {
        }
      }
    }
  }
  }
  for (let index = 0; index < yearLongClasses.length; index++) {
    const element = yearLongClasses[index];
    for (let i = 0; i < element.classes.length; i++) {
      const e = element.classes[i];
      scheduleArr[e.period-1][e.startQuarter-1] = new scheduleClass(element.className, element.classes, true)
      scheduleArr[e.period-1][e.endQuarter-1] = new scheduleClass(element.className, element.classes, true)

      
    }
    
  }
  for (let index = 0; index < priorityClasses.length; index++) {
    const fillClass = priorityClasses[index];
    var uhOhFlag = false;
    for (let i = 0; i < fillClass.classes.length; i++) {
      const indClass = fillClass.classes[i];
      if (
        scheduleArr[indClass.period - 1][indClass.startQuarter - 1] === "" &&
        scheduleArr[indClass.period - 1][indClass.endQuarter - 1] === ""
      ) {
        scheduleArr[indClass.period - 1][indClass.startQuarter - 1] =
          new scheduleClass(fillClass.className, fillClass.classes, false);
        scheduleArr[indClass.period - 1][indClass.endQuarter - 1] =
          new scheduleClass(fillClass.className, fillClass.classes, false);
        break;
      } else {
        if (i < fillClass.classes.length) {
          uhOhFlag = true;
        }
      }
    }

    if (uhOhFlag === true) {
      for (let i = 0; i < fillClass.classes.length; i++) {
        const element = fillClass.classes[i];
        if (
          scheduleArr[element.period - 1][
            element.startQuarter - 1
          ].seeAndSwitch() === true
        ) {
          scheduleArr[element.period - 1][element.startQuarter - 1] =
            new scheduleClass(fillClass.className, fillClass.classes, false);
          scheduleArr[element.period - 1][element.endQuarter - 1] =
            new scheduleClass(fillClass.className, fillClass.classes, false);
          break;
        } else {
        }
      }
    }
  }
  return scheduleArr;
}
function displaySchedule(scheduleArr){
  for (let i = 0; i < scheduleArr.length; i++) {
    const period = scheduleArr[i];
    var printLine = ""
    for (let index = 0; index < period.length; index++) {
      const cl = period[index];
      var printLine = printLine.concat(cl.className, " | ")
      
    }
    console.log(printLine)
  }
}
async function run() {
  var primClasses = [];
  var yearLongClasses = [];
  yearLongClasses.push(await getClass("Symphonic Band"))
  primClasses.push(await getClass("Int Math 3"));
  primClasses.push(await getClass("English 10"));
  primClasses.push(await getClass("Honors English 10"));
  primClasses.push(await getClass("French 1"));

displaySchedule(schedule(yearLongClasses, primClasses));
}
run();
