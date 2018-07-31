import { Request, Response } from 'express';
import { Client } from 'pg';
import * as Joi from 'joi';


export let members = (req: Request, res: Response) => {
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
    .catch(err => res.status(500).send(`error connecting to db! \n${err.stack}`));

    // assemble the db query
    const params = {
        text: `SELECT * FROM voting_list WHERE first_name ~* '^${query.name}' UNION SELECT * FROM invalid_address WHERE first_name ~* '^${query.name}' LIMIT 10;`
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
            .then(() => console.log('client has disconnected'))
            .catch(err => console.error('error during disconnection', err.stack));
    });
}

export let memberId = (req: Request, res: Response) => {
    res.send('hi');
}

export let hi = (req: Request, res: Response) => {
    res.send('HI!!!!');
}