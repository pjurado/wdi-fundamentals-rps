$(document).ready(function() {
    // Application state
    let players = [];
    let teams = [];
    
    // Team colors for selection
    const teamColors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
        '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
        '#10AC84', '#EE5A24', '#0ABDE3', '#C44569', '#F8B500'
    ];
    
    // Skill level values for team balancing
    const skillValues = {
        'beginner': 1,
        'intermediate': 2,
        'baller': 3
    };
    
    // DOM elements
    const $playerForm = $('#player-form');
    const $playerName = $('#player-name');
    const $skillLevel = $('#skill-level');
    const $playersList = $('#players-list');
    const $playerCount = $('#player-count');
    const $generateBtn = $('#generate-teams-btn');
    const $clearAllBtn = $('#clear-all-btn');
    const $teamsSection = $('#teams-section');
    const $teamsContainer = $('#teams-container');
    const $regenerateBtn = $('#regenerate-btn');
    
    // Event listeners
    $playerForm.on('submit', handleAddPlayer);
    $generateBtn.on('click', generateTeams);
    $clearAllBtn.on('click', clearAllPlayers);
    $regenerateBtn.on('click', generateTeams);
    
    function handleAddPlayer(e) {
        e.preventDefault();
        
        const name = $playerName.val().trim();
        const skill = $skillLevel.val();
        
        if (name && skill) {
            // Check for duplicate names
            if (players.some(player => player.name.toLowerCase() === name.toLowerCase())) {
                alert('A player with this name already exists!');
                return;
            }
            
            addPlayer(name, skill);
            $playerForm[0].reset();
            $playerName.focus();
        }
    }
    
    function addPlayer(name, skill) {
        const player = {
            id: Date.now(),
            name: name,
            skill: skill,
            skillValue: skillValues[skill]
        };
        
        players.push(player);
        updatePlayersDisplay();
        updateGenerateButton();
    }
    
    function removePlayer(playerId) {
        players = players.filter(player => player.id !== playerId);
        updatePlayersDisplay();
        updateGenerateButton();
        
        // Hide teams section if no players
        if (players.length === 0) {
            $teamsSection.hide();
        }
    }
    
    function updatePlayersDisplay() {
        $playerCount.text(players.length);
        
        if (players.length === 0) {
            $playersList.html('<p class="empty-state">No players added yet. Add some players to get started!</p>');
            return;
        }
        
        const playersHtml = players.map(player => `
            <div class="player-card" data-player-id="${player.id}">
                <div class="player-info">
                    <span class="player-name">${player.name}</span>
                    <span class="skill-badge skill-${player.skill}">${capitalizeFirst(player.skill)}</span>
                </div>
                <button class="remove-btn" onclick="removePlayerById(${player.id})" title="Remove player">×</button>
            </div>
        `).join('');
        
        $playersList.html(playersHtml);
    }
    
    function updateGenerateButton() {
        $generateBtn.prop('disabled', players.length < 2);
    }
    
    function generateTeams() {
        if (players.length < 2) {
            alert('You need at least 2 players to generate teams!');
            return;
        }
        
        // Determine number of teams (2 teams for most cases, 3 for larger groups)
        const numTeams = players.length <= 8 ? 2 : 3;
        teams = createBalancedTeams(players, numTeams);
        
        displayTeams();
        $teamsSection.show();
    }
    
    function createBalancedTeams(playerList, numTeams) {
        // Sort players by skill level (highest first) for better distribution
        const sortedPlayers = [...playerList].sort((a, b) => b.skillValue - a.skillValue);
        
        // Initialize teams
        const teams = Array.from({length: numTeams}, (_, i) => ({
            id: i + 1,
            name: `Team ${i + 1}`,
            players: [],
            totalSkill: 0,
            color: teamColors[i % teamColors.length]
        }));
        
        // Distribute players using a greedy approach
        // Always add to the team with the lowest total skill
        sortedPlayers.forEach(player => {
            // Find team with lowest total skill
            const targetTeam = teams.reduce((minTeam, team) => 
                team.totalSkill < minTeam.totalSkill ? team : minTeam
            );
            
            targetTeam.players.push(player);
            targetTeam.totalSkill += player.skillValue;
        });
        
        return teams;
    }
    
    function displayTeams() {
        const teamsHtml = teams.map(team => `
            <div class="team-card">
                <div class="team-header">
                    <h3>${team.name}</h3>
                    <div class="team-stats">
                        <span class="player-count">${team.players.length} players</span>
                        <span class="skill-total">Skill Total: ${team.totalSkill}</span>
                    </div>
                </div>
                <div class="color-selector">
                    <label>Team Color:</label>
                    <div class="color-options">
                        ${teamColors.map(color => `
                            <button class="color-option ${color === team.color ? 'selected' : ''}" 
                                    style="background-color: ${color}"
                                    onclick="changeTeamColor(${team.id}, '${color}')"
                                    title="Select color">
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div class="team-players" style="border-left: 4px solid ${team.color}">
                    ${team.players.map(player => `
                        <div class="team-player">
                            <span class="player-name">${player.name}</span>
                            <span class="skill-badge skill-${player.skill}">${capitalizeFirst(player.skill)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        $teamsContainer.html(teamsHtml);
    }
    
    function changeTeamColor(teamId, color) {
        const team = teams.find(t => t.id === teamId);
        if (team) {
            team.color = color;
            displayTeams();
        }
    }
    
    function clearAllPlayers() {
        if (players.length === 0) return;
        
        if (confirm('Are you sure you want to remove all players?')) {
            players = [];
            teams = [];
            updatePlayersDisplay();
            updateGenerateButton();
            $teamsSection.hide();
        }
    }
    
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Global functions for inline event handlers
    window.removePlayerById = removePlayer;
    window.changeTeamColor = changeTeamColor;
    
    // Initialize
    updatePlayersDisplay();
    updateGenerateButton();
});