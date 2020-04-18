const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const menusRouter = express.Router();
const menuItemRouter = require('./menuItem');


menusRouter.get('/',(req, res, next)=>{
   
    db.all("select * from Menu",function (error, menus){
        if(error){
            next(error);
        }else{
            res.status(200).json({menus: menus})
        }
    })
})

menusRouter.param('id',(req,res,next,id)=>{
    db.get("select * from Menu where id =$id",{
        $id: id
    },(error, menu)=>{
        if(error){
            next(error)
        }
        else if(menu){

            req.menu = menu;
            next();
        }else{
            res.sendStatus(404)
        }
    })
})

menusRouter.get('/:id',(req,res,next)=>{
    res.status(200).json({menu: req.menu});
})

const validateDependency = (req, res, next) =>{
    db.get('SELECT * FROM MenuItem where menu_id=$id',{
      $id: req.params.id  
    },function(error, menu){
        if(error){
            next(error)
        }else if(menu){
            res.sendStatus(400)
        }else{
            next();
        }
    })
}

menusRouter.delete('/:id',validateDependency,(req,res,next)=>{
    let data = req.menu;
        db.run('DELETE FROM Menu where id=$id',{
            $id: req.params.id
        },(error)=>{
            if(error){
                next(error)
            }
                    
                res.status(204).json({menu: data});
        
        })


})

const validateData = (req,res,next)=>{
    let data = req.body.menu;
    if(!data.title){
        res.sendStatus(400)
    }else{
        req.menu = data;
        next();
    }
}

menusRouter.put('/:id',validateData,(req,res,next)=>{
    let data = req.menu;
        db.run('UPDATE Menu SET title = $1 where id=$id',{
            $1: data.title,
            $id: req.params.id
        },function(error){
            if(error){
                next(error)
            }
                db.get("select * from Menu where id=$id",{
                    $id: req.params.id
                },function(error, row){
                    res.status(200).json({menu: row});
                })    
        
        })


})

menusRouter.post('/',validateData,(req,res,next)=>{
    let data = req.menu;
    db.run("INSERT into Menu (title) values($1);",{
        $1: data.title
    },function(error){
        if(error){
            next(error)
        }   console.log(this.lastID)
            db.get("select * from Menu where id=$id;",{
                $id: this.lastID
            },function(error, row){
                if(error){
                    next(error)
                }
                res.status(201).json({menu: row});
            })    
    
    })

})

menusRouter.use('/:id/menu-items/',menuItemRouter);


module.exports = menusRouter;