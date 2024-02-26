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
            ${index}
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
const createMoveStartFrame = () => {
    return `
    <tr class="move-startf">
        <td class="mv-id">Start</td>
        <td class="mv-frames">??</td>
    </tr>
    `
}
const createMoveStartFrameSegment = () => {
    return `
        <tr class="move-startf-seg">
            <td>??F = ?+?+?</td>
        </tr>
    `
}

// @TODO: blknegative needs to be dynamically changed
const createMoveBlockFrame = () => {
    return `
    <tr class="move-blockf">
        <td class="mv-id">Block</td>
        <td class="mv-frames blknegative">??</td>
    </tr>    `
}

const createMoveHitFrame = () => {
    return `
    <tr class="move-hitf">
        <td class="mv-id">Hit</td>
        <td class="mv-frames">??</td>
    </tr>
    `
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
                <div class="move-special"></div>
                <table class="move-frames">
                    <tbody>
                        ${createMoveStartFrame()}
                        ${createMoveStartFrameSegment()}
                        ${createMoveBlockFrame()}
                        ${createMoveHitFrame()}
                    </tbody>
                </table>
            </div>
        </div>
    </tr>
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
}

// @TODO: Add Rage Art and shit before the move
const createMoveInputs = (move) => {
    let movesHTML = ""
    const inputs = move.input.map(move => move.split(','))
    for (let i = 0; i < inputs.length; i++) {
        const moveInputs = inputs[i]
        moveInputs.forEach(input => {
            if (Object.keys(additionalMoveInputsMapping).includes(input)) {
                movesHTML += additionalMoveInputsMapping[input]
            } else {
                movesHTML += `<img class='move-arrow' src='./assets/button/XBOX/${input}.svg' />`
            }
        })
        if (i + 1 < inputs.length) {
            movesHTML += ' or '
        }
    }
    const htmlString = `
        <div class="move-string">
            ${movesHTML}
        </div>
    `
    return htmlString
}

const hardCodedChars = ['jun','reina']

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
