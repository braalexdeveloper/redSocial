const Follow = require("../models/follow");

const followUserIds = async (identityUserId) => {

    try {
        let following = await Follow.find({ "user": identityUserId })
            .select({ "_id": 0, "followed": 1 })
            .exec();

        let followers = await Follow.find({ "followed": identityUserId })
            .select({ "_id": 0, "user": 1 })
            .exec();

            //procesar array de identificadores
            let followingClean=[];

            following.forEach(follow=>{
                followingClean.push(follow.followed)
            })

            let followersClean=[];

            followers.forEach(follower=>{
                followersClean.push(follower.user)
            })

        return {
            following:followingClean,
            followers:followersClean
        }
    } catch (error) {
        return {};
    }



}

const followThisUser = async (identityUserId, profileUserId) => {
    let following = await Follow.findOne({ "user":identityUserId ,"followed":profileUserId});

let follower = await Follow.find({ "user":profileUserId,"followed":identityUserId });


    return {
        following,
        follower
    }
}

module.exports = {
    followUserIds,
    followThisUser
}