import passport from 'passport';
import basicStrategy from 'passport-http';

var BasicStrategy = basicStrategy.BasicStrategy;

passport.use(new BasicStrategy(
	function(username, password, done){
		if (username === 'admin' && password === 'admin') {
			return done(null, {username: 'admin'});
		}
		return done(null, false);
	}	
));

passport.serializeUser(function(user,done){
	done(null, user.username);
});

passport.deserializeUser(function(username,done){
	done(null, {username: username});
});

export default passport;
