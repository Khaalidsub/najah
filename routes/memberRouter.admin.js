const express = require('express');
const router = new express.Router();
const userDA = require('../viewModel/UserDA');
const isauthenticated = require('../middlewares/checkAuthentication');
const isAdmin = require('../middlewares/isAdmin');
router.get('/viewMembers', isauthenticated, isAdmin, async(req, res) => {
    const members = await userDA.fetchMembers();

    //for navigation recognition
    const user = req.user;
    user.password = '';

    if (members === null) {
        req.flash('noView', 'There are no members Registered!');
        res.render('admin/MembersView', {
            noView: req.flash('noView'),
            deleted: req.flash('deleted'),
            failure: req.flash('failure'),
            searchfailure: req.flash('nosearch'),
            admin: user
        });
    } else {
        res.render('admin/MembersView', {
            apps: members,
            deleted: req.flash('deleted'),
            failure: req.flash('failure'),
            searchfailure: req.flash('nosearch'),
            admin: user
        });
    }
});
//Admin can delete Member Profiles. After that That member has to be registered again

router.get('/deleteMember/:id', isauthenticated, isAdmin, async(req, res) => {
    const id = req.params.id;
    console.log(id);

    const val = await userDA.deleteMember(id);
    if (!val) {
        req.flash('failure', 'Error occured while Deleting!');
        res.redirect('/admin/viewMembers');
    } else {
        req.flash('deleted', 'Member has been deleted Successfully!');
        res.redirect('/admin/viewMembers');
    }
});

//route for member search
router.get('/searchMember', isauthenticated, isAdmin, async(req, res) => {
    const member = await userDA.searchUser(req.query.email);
    console.log(member);

    //for navigation recognition
    const user = req.user;
    user.password = '';

    if (member.length) {
        req.flash('foundsearch', 'We have found a member!');
        res.render('admin/MembersView', { apps: member, searchsuccess: req.flash('foundsearch'), admin: user });
    } else {
        req.flash('nosearch', 'No member found with this email. Please provide valid email.');
        res.redirect('/admin/viewMembers');
    }

    //remove sensitive credentials brefore sending the database object
});

module.exports = router