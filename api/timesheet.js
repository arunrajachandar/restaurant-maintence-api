const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const timesheetRouter = express.Router({mergeParams: true});

module.exports = timesheetRouter;


timesheetRouter.get('/',(req,res,next)=>{
    console.log(req.params);
    db.all("select * from Timesheet where employee_id=$id",{
        $id: req.params.employeeId
    },function(error, rows){
        console.log(rows);
        if(error){
            next(error);
        }else if(rows){
            res.status(200).json({timesheets: rows});
        }else{
            res.status(404).json({timesheets: []})
        }
    })

})


const validateData = (req,res,next)=>{
    let data = req.body.timesheet;
    console.log(data)
    if(!data.hours ||!data.rate||!data.date){
        res.sendStatus(400)
    }else{ 
           req.timesheet = data;
    next();
    }
    
}
timesheetRouter.post('/',validateData,(req,res,next)=>{
    let data = req.timesheet;
    db.run("INSERT into Timesheet (hours, rate, date, employee_id) values($hours,$rate,$date,$employeeId);",{
        $hours:data.hours,
        $rate: data.rate,
        $date: data.date,
        $employeeId: req.params.employeeId
    },function(error){
        if(error){
            next(error)
        }   console.log(this.lastID)
            db.get("select * from Timesheet where id=$id;",{
                $id: this.lastID
            },function (error, row){
                if(error){
                    next(error)
                }
                res.status(201).json({timesheet: row});
            })    
    
    })

})


timesheetRouter.param('timesheetId',(req,res,next,id)=>{
    db.get("select * from Timesheet where id=$id",{
    $id: id
    },function (error, row){
        if(error){
            next(error)
        }else if(row){
            req.timesheet =req.body.timesheet;
            next()
        }else{
            res.sendStatus(404)
        }

    })
})
timesheetRouter.put('/:timesheetId',validateData,(req,res,next)=>{
    let data = req.timesheet;
        db.run('UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date, employee_id = $employeeId where id = $timesheetId;',{
            $hours:data.hours,
            $rate: data.rate,
            $date: data.date,
            $employeeId: req.params.employeeId,
            $timesheetId: req.params.timesheetId
        },function(error){
            if(error){
                next(error)
            }
                db.get("select * from Timesheet where id=$timesheetId",{
                    $timesheetId: req.params.timesheetId
                },function (error, row){
                    res.status(200).json({timesheet: row});
                })    
        
        })


})
timesheetRouter.delete('/:timesheetId',(req,res,next)=>{
    db.run('DELETE from Timesheet where id=$id',{
        $id: req.params.timesheetId
    },(error)=>{
        if(error){
            next(error)
        }else{
            res.sendStatus(204)

        }
                
    
    })


})
