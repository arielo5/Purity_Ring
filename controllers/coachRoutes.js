const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Team, Player, Coach, Fan } = require('../models');
const withAuth = require('../utils/auth');
const { route } = require('./api/coachProfileRoutes');

router.get('/', (req, res) => {
    Coach.findAll({
      where: {
        // use the ID from the session
        user_id: req.session.user_id
      },
      attributes: [
        'id',
        'user_id',
        'team_id'
      ],
      include: [
        {
          model: Team,
          attributes: ['id', 'name'],
        },
        {
          model: Player,
          attributes: ['id', 'jersey_num', 'user_id', 'coach_id'],
          include: {
            model: User,
            attributes: ['first_Name', 'last_Name']
          }
        },  
        {
          model: User,
          attributes: ['first_Name', 'last_Name']
        }
      ]
    })
      .then(dbCoachData => {
        // serialize data before passing to template
        const coach = dbCoachData.map(coach => coach.get({ plain: true }));
        res.render('cprofile', { coach, loggedIn: true });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.get('/edit'), (req, res) => {
    
  }
  router.get('/edit/:id', (req, res) => {
    User.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'first_name',
        'last_name'
      ],
      include: [ 
        {
          model: Coach,
          attributes: ['id', 'team_name']
        }
      ]
    })
      .then(dbCoachData => {
        if (!dbCoachData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
  
        // serialize the data
        const coach = dbCoachData.get({ plain: true });

        res.render('edit-cprofile', {
            coach,
            loggedIn: req.session.loggedIn,
            is_coach: req.session.is_coach
            });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// router.get("/cprofile", (req, res) => {
//   res.send("WOOOOOOOWOWOWOWOWOWO COACH PROFILE");
// })


module.exports = router;