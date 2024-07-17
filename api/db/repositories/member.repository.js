const Repository = require('./repository');
const MemberModel = require('../models/member.model');

class MemberRepository extends Repository {
  constructor() {
    super(MemberModel)
  }
}

module.exports = MemberRepository;