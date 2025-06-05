const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../database/models/userModel'); // Assurez-vous que le chemin est correct selon votre projet

// Se connecter à MongoDB
mongoose.connect('mongodb://localhost/argentBankDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch(err => console.log('Erreur de connexion MongoDB:', err));

// Fonction pour hacher les mots de passe des utilisateurs
async function updatePasswords() {
    try {
        const users = await User.find(); // Trouve tous les utilisateurs

        for (let user of users) {
            // Vérifie si le mot de passe est en texte clair (non haché)
            if (!user.password.startsWith('$2b$')) {
                const hashPassword = await bcrypt.hash(user.password, 12);
                user.password = hashPassword; // Met à jour le mot de passe avec le haché

                // Sauvegarde l'utilisateur avec le mot de passe haché
                await user.save();
                console.log(`Mot de passe pour ${user.email} mis à jour`);
            }
        }

        console.log('Mise à jour des mots de passe terminée');
        process.exit(); // Terminer le script après la mise à jour
    } catch (error) {
        console.error('Erreur lors de la mise à jour des mots de passe:', error);
        process.exit(1); // Si une erreur survient, on arrête le script avec une erreur
    }
}

// Appel de la fonction pour mettre à jour les mots de passe
updatePasswords();
