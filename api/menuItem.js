const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const menuItemRouter = express.Router({mergeParams: true});

module.exports = menuItemRouter;



menuItemRouter.get('/',(req,res,next)=>{
    db.all("select * from MenuItem where menu_id=$id",{
        $id: req.params.id
    },function(error, rows){
        if(error){
            next(error);
        }else if(rows){
            res.status(200).json({menuItems: rows});
        }else{
            res.status(404).json({menuItems: []})
        }
    })

})


const validateData = (req,res,next)=>{
    let data = req.body.menuItem;
    if(!data.name ||!data.inventory||!data.price){
        res.sendStatus(400)
    }else{ 
           req.menuItem = data;
            next();
    }
    
}
menuItemRouter.post('/',validateData,(req,res,next)=>{
    let data = req.menuItem;

    db.run("INSERT into MenuItem (name, inventory, description, price, menu_id) values($name,$inventory,$description, $price,$menuId);",{
        $name:data.name,
        $inventory: data.inventory,
        $description: data.description,
        $price: data.price,
        $menuId: req.params.id
    },function(error){
        if(error){
            next(error)
        }   console.log(this.lastID)
            db.get("select * from MenuItem where id=$id;",{
                $id: this.lastID
            },function (error, row){
                if(error){
                    next(error)
                }
                res.status(201).json({menuItem: row});
            })    
    
    })

})


menuItemRouter.param('menuItemId',(req,res,next,id)=>{
    db.get("select * from MenuItem where id=$id",{
    $id: id
    },function (error, row){
        if(error){
            next(error)
        }else if(row){
            req.menuItem =req.body.menuItem;
            next()
        }else{
            res.sendStatus(404)
        }

    })
})
//name, inventory, description, price, menu_id
menuItemRouter.put('/:menuItemId',validateData,(req,res,next)=>{
    let data = req.menuItem;
        db.run('UPDATE MenuItem SET name = $name, inventory = $inventory, description = $description, price = $price where id = $menuItemId;',{
            $name:data.name,
            $inventory: data.inventory,
            $description: data.description,
            $price: data.price,
            $menuItemId: req.params.menuItemId
        },function(error){
            if(error){
                next(error)
            }
                db.get("select * from MenuItem where id=$menuItemId",{
                    $menuItemId: req.params.menuItemId
                },function (error, row){
                    res.status(200).json({menuItem: row});
                })    
        
        })


})
menuItemRouter.delete('/:menuItemId',(req,res,next)=>{
    db.run('DELETE from MenuItem where id=$id',{
        $id: req.params.menuItemId
    },(error)=>{
        if(error){
            next(error)
        }else{
            res.sendStatus(204)

        }
                
    
    })


})
