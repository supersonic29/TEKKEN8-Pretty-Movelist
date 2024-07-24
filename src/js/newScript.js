const baseAssetUrl = './assets/newAssets/img/'

const loadCharacterData = async (characterName) => {
    const response = await fetch(`./assets/newAssets/data/${characterName}.json`)
    return await response.json()
}
const damageValueMapping = {
    'M': 'Mid',
    'H': 'High',
    'L': 'Low',
    'SM': 'Smid'
}
const additionalMoveInputsMapping = {
    'FC': 'Full Crouch'
}
// @TODO: Make On Click Load Moves
const addCharacterThumbnail = async (characterJSON) => {
    const characterName = characterJSON.character
    const characterThumbnail = characterJSON.thumbnail

    const ID = 'characterSelect'
    const tableElement = document.getElementById(ID)
    const tableRow = document.createElement('tr')

    const HTML = `
        <td class=char-card id=${characterName}>
            <img src=${baseAssetUrl + characterThumbnail} />
            <p>${characterName}</p>
        </td>
    `
    tableRow.onclick = () => addCharacterMoves(characterJSON)

    tableRow.innerHTML = HTML;
    tableElement.append(tableRow)

}
const createMoveNumber = (index) => {
    return `
        <div class="move-number">
            ${index + 1}
        </div>`
}
const createMoveTitle = (move) => {
    const isHitOrHits = (damageValues) => damageValues.length > 1 ? 'Hits' : 'Hit'
    return `
    <div class="move-title">
        <div class="move-name"> 
            ${move.name}
        </div>
        <div class="move-hitamount">
            ${move.damageValues.length} ${isHitOrHits(move.damageValues)}
        </div>
    </div>
`
}
const createMoveHitDamage = (move) => {
    const RIGHT_CHEVRON = `<i class="fa fa-chevron-right" aria-hidden="true"></i>`
    const moveHTML = move.damageValues.map((damageValue, index) => {
        let damageHTML = ""
        const isLastItem = index + 1 === move.damageValues.length
        const damageWord = damageValueMapping[damageValue.level]

        damageHTML += `<div class='mv-hitlvl hitmid'>${damageWord}</div>`
        if (!isLastItem) {
            damageHTML += RIGHT_CHEVRON
        }
        return damageHTML
    })
    const HTML = `
    <div class="move-hit-dmg">
        <div class="move-hitlvlstring">
            ${moveHTML.join('')}
        </div>
        ${createTotalDamage(move)}
        ${createDamageBreakdownString(move)}
    </div>
    `
    return HTML
}

const createTotalDamage = (move) => {
    const allDamages = move.damageValues.map(damageValue => damageValue.damage)
    return `
    <div class="move-dmg">
        <p class="mv-frames">${allDamages.join(' + ')}</p>
    </div>`
}

// @TODO: This needs to be fixed
const createDamageBreakdownString = (move) => {
    const damageValuesElement = document.createElement('div')
    damageValuesElement.className = 'move-hitdmg'
    const damageValues = move.damageValues.map(damageValue => damageValue.damage)
    damageValuesElement.innerText = damageValues.join(' + ')

    const plusIconElement = document.createElement('i')
    plusIconElement.className = 'fa fa-plus-square'
    plusIconElement.ariaHidden = "true"
    plusIconElement.onmouseenter = () => { console.log('ass'); damageValuesElement.style.display = "initial" }
    plusIconElement.onmouseleave = () => { setTimeout(() => { damageValuesElement.style.display = "none" }, 3000) }

    return `${damageValuesElement.outerHTML}`

}

const getHitProperty = (hitProperty) => {
    if (hitProperty.launchNH) return 'LNC'
    if (hitProperty.knockdownNH) return 'KDN'
    return ''
}

const getCounterHitProperty = (hitProperty) => {
    if (hitProperty.launchCH) return 'LNC'
    if (hitProperty.knockdownCH) return 'KDN'
    return ''
}

const createMoveStartFrame = (move) => {
    return `
    <tr class="move-startf">
        <td class="mv-id">Start</td>
        <td class="mv-frames">${move.startup}</td>
        <td></td>
    </tr>
    `
}

const createMoveBlockFrame = (move) => {
    return `
    <tr class="move-blockf">
        <td class="mv-id">Block</td>
        <td class="mv-frames ${move.block < 0 ? "blknegative" : move.block === 0 ? "blkzero" : "blkpositive"}">${move.block}</td>
        <td></td>
    </tr>    `
}

const createMoveHitFrame = (move) => {
    return `
    <tr class="move-hitf">
        <td class="mv-id">Hit</td>
        <td class="mv-frames ${move.normalHit < 0 ? "blknegative" : move.normalHit === 0 ? "blkzero" : "blkpositive"}">${move.normalHit}</td>
        <td>${getHitProperty(move.properties)}</td>
    </tr>
    `
}

const createMoveCounterHitFrame = (move) => {
    return `
    <tr class="move-counterhitf">
        <td  class="mv-id">Counter Hit</td>
        <td class="mv-frames ${move.counterHit < 0 ? "blknegative" : move.counterHit === 0 ? "blkzero" : "blkpositive"}">${move.counterHit}</td>
        <td>${getCounterHitProperty(move.properties)}</td>
    </tr>
    `
}

const badgeToImageMap = {
    'powerCrush': 'powerCrush.png',
    'homing': 'homing.png',
    'tornado': 'tornado.png',
    'forceCrouch': 'forceCrouch.png',
    'heatEngager': 'heatEngager.png',
    'eraseRecoverable': 'eraseRecoverable.png',
    'wallBreak': 'wallBreak.png',
    'floorBreak': 'floorBreak.png',
}

const createBadgeImages = (move) => {
    const badgeImages = Object.keys(badgeToImageMap).map(badgeName => {
        const badge = move.properties[badgeName]
        console.log('THE BADGE!', badge)
        if (!badge) return null
        
        return `<img style="width: 36px; height: 36px;" src='/assets/newAssets/${badgeToImageMap[badgeName]}' />`
    }).filter(x => x)
    return badgeImages.join('')
}

const createMoveHTML = (index, move) => {
    const tableRow = document.createElement('tr')
    const HTML = `
    <td class="move-card">
        <div class="move-info">
            ${createMoveNumber(index)}
            ${createMoveTitle(move)}
            ${createMoveInputs(move)}
            ${createMoveHitDamage(move)}
        </div>
        <div class="move-extra">
            <div class="mv-section">
                <div class="move-special">
                    <div style="display: flex; justify-content:  flex-end;">
                        <div >
                        ${move.frameProperties.jumpFrame >= 0 ? 'JUMP START&nbsp;' : ''}
                        </div>
                        <div>
                            ${move.frameProperties.jumpFrame >= 0 ? move.frameProperties.jumpFrame : ''}
                        </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end;">
                    <div>
                    ${move.frameProperties.crouchFrame >= 0 ? 'CROUCH START&nbsp;' : ''}
                        </div>
                        <div>
                            ${move.frameProperties.crouchFrame >= 0 ? move.frameProperties.crouchFrame : ''}
                        </div>
                    </div>
                    <div style="display: flex;">
                        <div style="white-space: nowrap;">
                        ${move.frameProperties.powerCrushFrame > 0 ? 'P-CRUSH' : ''}
                        </div>
                        <div>
                            ${move.frameProperties.powerCrushFrame > 0 ? '&nbsp;' + move.frameProperties.powerCrushFrame : ''}
                        </div>
                        <div style="display: flex; flex-wrap: wrap;"> 
                            ${createBadgeImages(move)}
                        </div>
                    </div>
                </div>
                <table class="move-frames">
                    <tbody>
                        ${createMoveStartFrame(move)}
                        ${createMoveBlockFrame(move)}
                        ${createMoveHitFrame(move)}
                        ${createMoveCounterHitFrame(move)}
                    </tbody>
                </table>
            </div>
        </div>
    </td>
    <td class="move-notes">
    ${move.notes.map((note) => `
        <div class="move-info">
            ${note}
        </div>
        `).join('')}
    </td>
    `
    tableRow.innerHTML = HTML
    return tableRow

}

const addCharacterMoves = (characterJSON) => {
    const MOVE_LIST_TAB_ID = 'moveTable'
    const table = document.getElementById(MOVE_LIST_TAB_ID)
    table.innerHTML = ""

    characterJSON.moves.forEach((move, index) => {
        table.appendChild(createMoveHTML(index, move))
    });

    document.getElementById('selected-title').innerText = characterJSON.character
}

function processString(input) {
    // Step One
    let stepOne = input.replace(/\s/g, '$').replace(/([a-zA-Z])\+([0-9])/g, '$1$2');

    // Step Two
    let stepTwo = stepOne.split(/([,\~\[\]\$])|(?<=[a-zA-Z])(?=\d)|(?<=\d)(?=[a-zA-Z])/).filter(Boolean);

    // Step Three
    for (let i = 0; i < stepTwo.length; i++) {
        if (stepTwo[i] === 'T!' && stepTwo[i - 1] === '$') {
            stepTwo.splice(i - 1, 1);
        }
    }

    // Step Four
    for (let i = 0; i < stepTwo.length; i++) {
        if (/^[A-Z]{3}$/.test(stepTwo[i]) && stepTwo[i + 1] === '$') {
            stepTwo.splice(i + 1, 1);
        }
    }

    // Step Five
    let stepFive = stepTwo.filter(element => element !== ',' && element !== '~');

    return stepFive;
}

// @TODO: Add Rage Art and shit before the move
const createMoveInputs = (move) => {
    let movesHTML = ""
    /*const inputs = move.input.map(move => move.split(','))
    for (let i = 0; i < inputs.length; i++) {
        const moveInputs = inputs[i]
        moveInputs.forEach(input => {
            if (Object.keys(additionalMoveInputsMapping).includes(input)) {
                movesHTML += additionalMoveInputsMapping[input]
            } else {
                movesHTML += `<img class='move-arrow' src='./assets/newAssets/btn/${input}.png' />`
            }
        })
        if (i + 1 < inputs.length) {
            movesHTML += ' or '
        }
    }*/
    const inputs = processString(move.input[0])
    inputs.forEach(input => {
        if (Object.keys(additionalMoveInputsMapping).includes(input)) {
            movesHTML += additionalMoveInputsMapping[input]
        } else {
            movesHTML += `<img class='move-arrow' src='./assets/newAssets/btn/${input}.png' />`
        }
    });

    const htmlString = `
        <div class="move-string">
            ${movesHTML}
        </div>
    `
    return htmlString
}

const hardCodedChars = ['jun', 'reina']

const main = async () => {
    for (let i = 0; i < hardCodedChars.length; i++) {
        const characterJSON = await loadCharacterData(hardCodedChars[i])
        addCharacterThumbnail(characterJSON)
        addCharacterMoves(characterJSON)
    }
}

(async function () {
    main()

})()
