import express from "express";
import { promises as fs } from "fs";

const router = express.Router();
const filename = 'car-list.json';

// Return brand with most models
// In case it's a tie, return a list with all brands
router.get('/mostModels', async (req, res, next) => {

    try {
        let carList = JSON.parse(await fs.readFile(filename));
        
        // create property with array size
        carList.forEach(element => {
            element.count = element.models.length
        });

        // sort by array size, descending
        carList = carList.sort((a, b) => {
            if (a.count > b.count) { return -1; }
        });

        // define max array size
        const maxModels = carList[0].count;

        // filter original list by max size
        const maxBrands = carList.filter(
            (brand) => brand.count === maxModels
        );

        const max = [];
        maxBrands.forEach(element => {
            max.push(element.brand)}
            );

        res.send(max);
        console.log(carList);
        
    } catch (error) {
        next(error);
    }

});


// Return brand with most models
// In case it's a tie, return a list with all brands
router.get('/leastModels', async (req, res, next) => {

    try {
        let carList = JSON.parse(await fs.readFile(filename));
        
        // create property with array size
        carList.forEach(element => {
            element.count = element.models.length
        });

        // sort by array size, descending
        carList = carList.sort((a, b) => {
            if (a.count < b.count) { return -1; }
        });

        // define max array size
        const minModels = carList[0].count;

        // filter original list by max size
        const minBrands = carList.filter(
            (brand) => brand.count === minModels
        );

        const min = [];
        minBrands.forEach(element => {
            min.push(element.brand)}
            );

        res.send(min);
        console.log(carList);
        
    } catch (error) {
        next(error);
    }

});


// Generic error handling for all routes
router.use((err, req, res, next) => {
    console.log(err.message);
    res.status(400).send({ error: err.message });
});

export default router;