const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const employeesRouter = express.Router();
const timesheetRouter = require('./timesheet');


employeesRouter.get('/',(req, res, next)=>{
   
    db.all("select * from Employee where is_current_employee  = $id",{
        $id: '1'
    },(error, employees)=>{
        if(error){
            next(error);
        }else{
            res.status(200).json({employees: employees})
        }
    })
})

employeesRouter.param('employeeId',(req,res,next,id)=>{
    db.get("select * from Employee where id =$id",{
        $id: id
    },(error, employee)=>{
        if(error){
            next(error)
        }
        else if(employee){

            req.employee = employee;
            next();
        }else{
            res.sendStatus(404)
        }
    })
})

employeesRouter.get('/:employeeId',(req,res,next)=>{
    console.log(req.employee)
    res.status(200).json({employee: req.employee});
})

employeesRouter.delete('/:employeeId',(req,res,next)=>{
    let data = req.employee;
        db.run('UPDATE Employee SET is_current_employee  = 0 where id=$id',{
            $id: data.id
        },(error)=>{
            if(error){
                next(error)
            }
                    
                res.status(200).json({employee: data});
        
        })


})

const validateData = (req,res,next)=>{
    let data = req.body.employee;
    if(!data.name || !data.position ||!data.wage){
        res.sendStatus(400)
    }
    req.employee = data;
    next();
}

employeesRouter.put('/:employeeId',validateData,(req,res,next)=>{
    let data = req.employee;
    let currrentlyEmployeed = req.employee.is_current_employee === 0 ? 0 : 1;
        db.run('UPDATE Employee SET is_current_employee = $1, name= $2, wage = $3, position = $4 where id=$id',{
            $1: currrentlyEmployeed,
            $2: data.name,
            $3: data.wage,
            $4: data.position,
            $id: req.params.employeeId
        },(error)=>{
            if(error){
                next(error)
            }
                db.get("select * from Employee where id=$id",{
                    $id: req.params.employeeId
                },(error, row)=>{
                    res.status(200).json({employee: row});
                })    
        
        })


})

employeesRouter.post('/',validateData,(req,res,next)=>{
    let data = req.employee;
    let currrentlyEmployeed = req.employee.is_current_employee === 0 ? 0 : 1;
    db.run("INSERT into Employee (is_current_employee, name, wage , position  ) values($1,$2,$3,$4);",{
        $1: currrentlyEmployeed,
        $2: data.name,
        $3: data.wage,
        $4: data.position
    },function(error){
        if(error){
            next(error)
        }   console.log(this.lastID)
            db.get("select * from Employee where id=$id;",{
                $id: this.lastID
            },(error, row)=>{
                if(error){
                    next(error)
                }
                res.status(201).json({employee: row});
            })    
    
    })

})

employeesRouter.use('/:employeeId/timesheets/',timesheetRouter);


module.exports = employeesRouter;