const worldsModel = {
    getALL:`
        SELECT
                *
        FROM 
            world
        `,
        getByID:`
          SELECT
                *
            FROM
                 world
            WHERE
                id=?
      `,
      getByUsername:`
                   SELECT
                        *
                   FROM
                          world
                  WHERE
                         year = ?

                       `,
                       addRow:`
            INSERT INTO
                world(
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

                    )VALUES(                                                                                                                                                 
                         ?,?,?,?,?,?,?,?,?,?,?,?
                    )
                 `,
                 updateRow:`
                      UPDATE
                           world
                        SET
                        password = ?,
                        year = ?,
                        country = ?,
                        winner = ?,
                        runnersup = ?,
                        third = ?,
                        goalsscored = ?,
                        qualifiedteams = ?,
                        matchesplayed = ?,
                        attendance = ?,
                        fourth = ?,
                        is_active =?
                  WHERE
                       id = ?
                 `,
                 deleteRow:`
                      UPDATE
                        world
                      SET 
                          is_active = 0
                      WHERE
                           id = ?
                           `,

} 

module.exports = worldsModel;