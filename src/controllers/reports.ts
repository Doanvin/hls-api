import { Request, Response } from 'express';
import { Client } from 'pg';
import * as Joi from 'joi';


export const getReports = (req: Request, res: Response) => {
    const query = { name: req.query['q'] };
    const schema = { name: Joi.string().regex(/^[a-z ,.'-]+$/i) };

    // validate user input
    const validation = Joi.validate(query, schema);
    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message);
    }

    // create new client
    const client = new Client();

    // connect to the db
    client.connect()
    .catch(err => res.status(500).send(`Error connecting to db! \n${err.stack}`));

    // assemble the db query
    const date = new Date();
    let dateNow = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}`;
    const params = {
        text: `SELECT name, date, date_exp, rating, gps, report, access
        FROM   reports
        WHERE  name        = '${query.name}'
        AND    date       <= '${dateNow}'::date
        AND    date_exp   >= '${dateNow}'::date;`
    };

    // query the db
    client.query(params, (queryError, queryResult) => {
        if (queryError) {
            console.error(queryError.stack);
            res.status(500).send('Error in database query');
        } else {
            res.send(queryResult.rows);
        }

        // diconnect from the db
        client.end()
            .then(() => console.log('client has disconnected'))
            .catch(err => console.error('error during disconnection', err.stack));
    });
}

export const postReports = (req: Request, res: Response) => {
    console.log(req.body)
    const query = {
        name: req.body.name,
        date: req.body.date,
        date_exp: req.body.date_exp,
        rating: req.body.rating,
        report: req.body.report,
        access: req.body.access,
        type: req.body.type,
        user: req.body.user
    };

    const schema = Joi.object().keys({
        name: Joi.string().alphanum().min(3).max(15).required(),
        date: Joi.string().email({ minDomainAtoms: 2 }).required(),
        date_exp: Joi.string().regex(/^[a-z ,.'-]+$/i).min(3).max(50).required(),
        rating: Joi.string().regex(/^[a-z ,.'-]+$/i).required(),
        report: Joi.string().regex(/^[a-z ,.'-]+$/i).required(),
        access: Joi.string().regex(/^[a-z ,.'-]+$/i).required(),
        type: Joi.string().regex(/^[a-z ,.'-]+$/i).required(),
        user: Joi.string().regex(/^[a-z ,.'-]+$/i).required()
    });

    // validate user input
    const validation = Joi.validate(query, schema);
    if (validation.error) {
        return res.status(400).send(validation.error.details);
    }

    // create new client
    const client = new Client();

    // connect to the db
    client.connect()
    .catch(err => res.status(500).send(`Error connecting to db! \n${err.stack}`));

    // assemble the db query
    const params = {
        text: ``
    };

    // query the db
    client.query(params, (queryError, queryResult) => {
        if (queryError) {
            console.error(queryError.stack);
        } else {
            res.send(queryResult.rows);
        }

        // diconnect from the db
        client.end()
            .then(() => console.log('Client has disconnected'))
            .catch(err => console.error('Error during disconnection', err.stack));
    });
}