import User from "../models/user.model.js";

export const getUserProfileAndRepos = async (req, res) => {
	const { username } = req.params;
	try {
		const userRes = await fetch(`https://api.github.com/users/${username}`, {
			headers: {
				authorization: `token ${process.env.GITHUB_API_KEY}`,
			},
		});
		const userProfile = await userRes.json();

		const reposRes = await fetch(userProfile.repos_url, {
			headers: {
				authorization: `token ${process.env.GITHUB_API_KEY}`,
			},
		});
		const repos = await reposRes.json();

		res.status(200).json({ userProfile, repos });
	} catch (error) {
		console.log("Error in getUserProfileAndRepos controller: ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const likeProfile = async (req, res) => {
	const { username } = req.params;

	try {
		const user = await User.findById(req.user._id.toString());
		const userToLike = await User.findOne({ username });
		if (!userToLike) {
			return res.status(404).json({ error: "User can't be found" });
		}
		if (user.likedProfiles.includes(userToLike.username)) {
			return res.status(400).json({ error: "User already liked" });
		}

		userToLike.likedBy.push({
			username: user.username,
			avatarUrl: user.avatarUrl,
			likedDate: Date.now(),
		});
		user.likedProfiles.push(userToLike.username);

		await Promise.all([userToLike.save(), user.save()]);
		res.status(200).json({ message: "User liked" });
	} catch (error) {
		console.log("Error in likeProfile controller: ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getLikes = async (req, res) => {
	try {
		const user = await User.findById(req.user._id.toString());
		res.status(200).json({ likedBy: user.likedBy });
	} catch (error) {
		console.log("Error in getLikes controller: ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
