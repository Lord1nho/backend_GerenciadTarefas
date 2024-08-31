import jwt from 'jsonwebtoken';
const { sign } = jwt;

// Usually I keep the token between 5 minutes - 15 minutes
function generateAccessToken(user) {
  return sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '1h',
  });
}

function generateRefreshToken(user, jti) {
    return jwt.sign({
      userId: user.id,
      jti
    }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '8h',
    });
  }
  
  function generateTokens(user, jti) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, jti);
  
    return {
      accessToken,
     refreshToken,
    };
  }
  
  export {generateAccessToken, generateRefreshToken, generateTokens} 