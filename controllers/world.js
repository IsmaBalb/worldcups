const {request, response} = require('express');
const bcrypt = require('bcrypt');
const worldsModel = require('../models/world');
const pool = require('../db');

const listworldcups = async (req = request, res = response) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const world = await conn.query(worldsModel.getALL, (err) =>{
            if(err){
                throw err;
            }

        })
        res.json(world);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);     
    }finally{
        if(conn){
            conn.end();
        }
    }
}

const listworldcupsByID = async (req = request, res = response) =>{
    const {id} = req.params;
    let conn;

    if(isNaN(id)){
        res.status(400).json({msg: `The ID ${id} is invalid`});
        return;
    }

    try {
        conn = await pool.getConnection();

        const [world] = await conn.query(worldsModel.getByID, [id], (err) => {
            if(err){
                throw err;
            }
        })

        if(!world){
            res.status(404).json({msg: `worldcups with ID ${id} not found`});
            return;
        }
        res.json(world);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn){
            conn.end();
        }
    }
}

const addworldcups =async (req = request, res = response) => {
    const {
        password,
        year,
        country,
        winner,
        runnersup,
        third,
        goalsscored,
        qualifiedteams,
        matchesplayed,
        attendance,
        fourth,
        is_active = 1
    }= req.body

    if(!password || !year || !country || !winner || !runnersup || !third || !goalsscored || !qualifiedteams || !matchesplayed
        || !attendance || !fourth){
        res.status(400).json({msg: 'Missing iformation'});
        return;

    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const world = [passwordHash, year, country, winner, runnersup, third, goalsscored, qualifiedteams, matchesplayed,
        attendance, fourth, is_active]
    let conn;

    try {
        conn = await pool.getConnection();

        const [usernameExist] = await conn.query(worldsModel.getByUsername, [year], (err) => {
            if(err) throw err;
        })
        if (usernameExist){
            res.status(409).json({msg: `The year ${year} already exists`});
            return;
        }

        const worldAdd = await conn.query(worldsModel.addRow, [...world], (err) =>{
            if(err) throw err;
        })
        if(worldAdd.affectedRows === 0){
            throw new Error('worldcups not added');
        }
        res.json({msg: 'worldcups added succesfully'});

        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn) conn.end();
    }
}

const updateWorldcups = async (req = request, res = response) =>{
    let conn;

    const{
        password,
        year,
        country,
        winner,
        runnersup,
        third,
        goalsscored,
        qualifiedteams,
        matchesplayed,
        attendance,
        fourth,
        is_active

    } = req.body;

    const {id} =req.params;

    let passwordHash;
    if(password){
        const saltRounds = 10;
        passwordHash = await bcrypt.hash(password, saltRounds);
    }

    let worldNewData = [
        passwordHash,
        year,
        country,
        winner,
        runnersup,
        third,
        goalsscored,
        qualifiedteams,
        matchesplayed,
        attendance,
        fourth,
        is_active
    ];
    
    try{
        conn = await pool.getConnection();

        const [worldExists] = await conn.query(worldsModel.getByID, [id], (err) =>{
            if(err) throw err;
        }
        );
        if(!worldExists || worldExists.is_active === 0){
            res.status(400).json({msg: `worldcups with ID ${id} not found`});
            return
        }
        const [usernameExist] = await conn.query(worldsModel.getByUsername, [year], (err) => {
            if(err) throw err;
        })
        if (usernameExist){
            res.status(409).json({msg: `worldcups ${year} already exists`});
            return;
        }

        const worldOldData = [
            worldExists.password,
            worldExists.year,
            worldExists.country,
            worldExists.winner,
            worldExists.runnersup,
            worldExists.third,
            worldExists.goalsscored,
            worldExists.qualifiedteams,
            worldExists.matchesplayed,
            worldExists.attendance,
            worldExists.fourth,
            worldExists.is_active,
        ];

        worldNewData.forEach((worldData, index) =>{
            if(!worldData){
                worldNewData[index] = worldOldData[index];
            }
        })
        const worldUpdated = await conn.query(
            worldsModel.updateRow,[...worldNewData, id],
            (err) => {
                if (err) throw err;
            }
        )
        if (worldUpdated.affectedRows === 0){
            throw new Error('worldcups not updated');
        }
        res.json({msg: 'worldcups updated succesfully'});
    }catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if(conn) conn.end();
    }
}

const deleteWorldcups = async (req = request, res = response)=>{
    let conn;
    const {id} = req.params;

    try {
        conn = await pool.getConnection();

        const [worldExists] = await conn.query(worldsModel.getByID, [id], (err) =>{
            if(err) throw err;
        }
        );
        if(!worldExists || worldExists.is_active === 0){
            res.status(400).json({msg: `worldcups with ID ${id} not found`});
            return
        }
        const worldDeleted = await conn.query(
            worldsModel.deleteRow, [id], (err) =>{
                if(err) throw err;
            }
        );
        if(worldDeleted.affectedRows === 0){
            throw new Error('worldcups not deleted');
        }
        res.json({msg: 'worldcups deleted succesfully'});

    } catch (error) {
        console.log(error);
        res.status(500).json(error);  
    }finally{
        if(conn) conn.end();
    }
}

const signInUser = async (req = request, res = response) =>{
    let conn;

    const {year, password} = req.body;

    try{
        conn = await pool.getConnection();

        if(!year || !password){
            res.status(400).json({msg: 'You must send year and password'});
            return;
        }

        const [world] = await conn.query(worldsModel.getByUsername,
            [year],
            (err) =>{
                if(err)throw err;
            }
            );
            if (!world){
                res.status(400).json({msg: `Wrong year or password`});
                return;
            }

            const passwordOK = await bcrypt.compare(password, world.password);

            if(!passwordOK){
                res.status(404).json({msg: `Wrong year or password`});
                return;
            }

            delete(world.password);

            res.json(world);
    }catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if(conn) conn.end();
    }
}

module.exports = {listworldcups, listworldcupsByID, addworldcups, updateWorldcups, deleteWorldcups, signInUser}
