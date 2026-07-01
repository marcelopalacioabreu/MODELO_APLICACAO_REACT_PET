const UserGamification = require('../models/UserGamification');
const moment = require('moment-timezone');

/**
 * Service de Elite para Gestão de Gamificação
 */
class GamificationService {
  /**
   * Atribui XP e Pontos a um usuário por uma ação realizada
   */
  async awardActivity(userId, actionKey) {
    const rewards = {
      'LOGIN': { xp: 10, points: 5 },
      'PET_REGISTERED': { xp: 100, points: 50 },
      'VACCINE_APPLIED': { xp: 150, points: 100 },
      'POST_SHARED': { xp: 20, points: 10 },
      'LIKE_RECEIVED': { xp: 5, points: 2 },
      'PROFILE_COMPLETED': { xp: 200, points: 100 }
    };

    const reward = rewards[actionKey] || { xp: 5, points: 1 };
    const today = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD');

    let stats = await UserGamification.findOne({ user: userId });

    if (!stats) {
      stats = new UserGamification({ user: userId });
    }

    // Lógica de Streak (Atividade Diária)
    if (stats.lastActivityDay) {
      const yesterday = moment().tz('America/Sao_Paulo').subtract(1, 'days').format('YYYY-MM-DD');
      if (stats.lastActivityDay === yesterday) {
        stats.streakCount += 1;
      } else if (stats.lastActivityDay !== today) {
        stats.streakCount = 1;
      }
    } else {
      stats.streakCount = 1;
    }

    stats.xp += reward.xp;
    stats.points += reward.points;
    stats.lastActivityDay = today;

    // Lógica de Level Up (Elite: Algoritmo Progressivo)
    const nextLevelXp = stats.level * stats.level * 1000;
    if (stats.xp >= nextLevelXp) {
      stats.level += 1;
      // TODO: Emitir evento Socket.io de Level Up
    }

    await stats.save();
    return stats;
  }

  /**
   * Verifica se um usuário tem pontos suficientes para promover um PET
   */
  async canPromote(userId, cost = 500) {
    const stats = await UserGamification.findOne({ user: userId });
    return stats && stats.points >= cost;
  }

  async usePoints(userId, amount) {
    const stats = await UserGamification.findOne({ user: userId });
    if (stats && stats.points >= amount) {
      stats.points -= amount;
      await stats.save();
      return true;
    }
    return false;
  }
}

module.exports = new GamificationService();
