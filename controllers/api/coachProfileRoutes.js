const router = require('express').Router();
const { User, Team, Player, Coach, Fan } = require('../../models');
const withAuth = require('../../utils/auth');
const sequelize = require('../../config/connection');

router.get('/', (req, res) => {
    console.log('======================');
    Coach.findAll({
      attributes: [
        'id',
        'user_id',
        'team_id'
      ],
      include: [
        {
          model: Team,
          attributes: ['id', 'name']
        },
        {
          model: Player,
          attributes: ['id', 'user_id', 'coach_id', 'team_id', 'jersey-num'],
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
    .then(dbCoachData => res.json(dbCoachData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  Coach.findOne({
    where: {
      id: req.params.id
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
        attributes: ['id', 'user_id', 'team_id', 'jersey_num'],
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
      if (!dbCoachData) {
        res.status(404).json({ message: 'No coach found with this id' });
        return;
      }
      res.render(dbCoachData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) => {
  console.log(req.session);
    Coach.create({
      user_id: req.session.user_id,
      team_id: req.session.team_id
    })
      .then(dbCoachData => res.json(dbCoachData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });   
});

router.put('/:id', withAuth, (req, res) => {
  Coach.update({
    user_id: req.session.user_id,
    team_id: req.session.team_id
    },
    {
      where: {
        id: req.params.id
      }
    })
    .then(dbCoachData => {
      if (!dbCoachData) {
        res.status(404).json({ message: 'No coach found with this id' });
        return;
      }
      res.json(dbCoachData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', withAuth, (req, res) => {
  Coach.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbCoachData => {
      if (!dbCoachData) {
        res.status(404).json({ message: 'No coach found with this id' });
        return;
      }
      res.json(dbCoachData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;