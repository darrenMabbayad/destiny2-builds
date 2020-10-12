import React from 'react'

function QuickDetailsModal({details, infoType}) {
    const modRegex = /(armorMod)|(weaponMod)/
    const otherRegex = /(weaponMod)|(weaponPerk)|(weaponIntrinsic)|(weaponMasterwork)|(itemSearch)|(subClassTalent)/
    function renderModal() {
        if (modRegex.test(infoType)) {
            return (
            <div>
                <h3>{details.sandboxPerk.name}</h3>
                <p>{details.sandboxPerk.description}</p>
            </div>
            )
        } else if (otherRegex.test(infoType)) {
            return (
                <div>
                    <h3>{details.displayProperties.name}</h3>
                    <p>{details.displayProperties.description}</p>
                </div>
                )
        }
    }
    return (
        <div>
            {renderModal()}   
        </div>
    )
}

export default QuickDetailsModal
