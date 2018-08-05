module.exports = function (app) {
  var accountController = require('../controllers/accountController');
  var proposalController = require('../controllers/proposalController');

  app.route('/account')
    .post(accountController.create_account);

  app.route('/account/:account_id')
    .get(accountController.get_account);

  app.route('/proposal')
    .post(proposalController.create_proposal)

  app.route('/vote')
    .post(proposalController.vote_on_proposal)
}