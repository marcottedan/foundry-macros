const smallXpIcon = `
    <style>
    .my-class1 {
      background-image: url("IWD/items/xp_tokens/simple_xp.png");
      background-repeat: no-repeat;
      background-position: top center;
    }
  </style>
  <div class="my-class1">
    <div>&nbsp;</div>&nbsp;
    <div>&nbsp;</div>
  </div>
`;

const mediumXpIcon = `
    <style>
    .my-class2 {
      background-image: url("IWD/items/xp_tokens/medium_xp.png");
      background-repeat: no-repeat;
      background-position: top center;
    }
  </style>
  <div class="my-class2">
    <div>&nbsp;</div>&nbsp;
    <div>&nbsp;</div>
  </div>
`;

const largeXpIcon = `
    <style>
    .my-class3 {
      background-image: url("IWD/items/xp_tokens/large_xp.png");
      background-repeat: no-repeat;
      background-position: top center;
    }
  </style>
  <div class="my-class3">
    <div>&nbsp;</div>&nbsp;
    <div>&nbsp;</div>
  </div>
`;
const heroicXpIcon = `
    <style>
    .my-class4 {
      background-image: url("IWD/items/xp_tokens/heroic_xp.png");
      background-repeat: no-repeat;
      background-position: top center;
    }
  </style>
  <div class="my-class4">
    <div>&nbsp;</div>&nbsp;
    <div>&nbsp;</div>
  </div>
`;
const legendaryXpIcon = `
    <style>
    .my-class5 {
      background-image: url("IWD/items/xp_tokens/legendary_xp.png");
      background-repeat: no-repeat;
      background-position: top center;
    }
  </style>
  <div class="my-class5">
    <div>&nbsp;</div>&nbsp;
    <div>&nbsp;</div>
  </div>
`;


let d = new Dialog({
    title: 'Get Experience',
    content: `Consume XP Token`,
    buttons: {
        one: {
            icon: smallXpIcon,
            label: 'Small&nbsp;XP&nbsp;[1]&nbsp;Token',
            callback: (html) => {
                IncrementXP(1);
            },
        },
        two: {
            icon: mediumXpIcon,
            label: 'Medium&nbsp;XP&nbsp;[2]&nbsp;Token',
            callback: (html) => {
                IncrementXP(2);
            },
        },
        three: {
            icon: largeXpIcon,
            label: 'Large&nbsp;XP&nbsp;[3]&nbsp;Token',
            callback: (html) => {
                IncrementXP(3);
            },
        },
        four: {
            icon: heroicXpIcon,
            label: 'Heroic&nbsp;XP&nbsp;[4]&nbsp;Token',
            callback: (html) => {
                IncrementXP(4);
            },
        },
        five: {
            icon: legendaryXpIcon,
            label: 'Legendary&nbsp;XP&nbsp;[5]&nbsp;Token',
            callback: (html) => {
                IncrementXP(5);
            },
        },
    },
}).render(true);

async function IncrementXP(xpValue) {

    currentXP = actor.data.data.details.xp.value;

    if (xpValue == 1) {
        let smallXP = actor.items.find(item => item.data.name == "Small XP [1] Token")
        IncrementXpAndRemoveXpToken(actor, xpValue, smallXP)
    } else if (xpValue == 2) {
        let mediumXP = actor.items.find(item => item.data.name == "Medium XP [2] Token")
        IncrementXpAndRemoveXpToken(actor, xpValue, mediumXP)
    } else if (xpValue == 3) {
        let largeXP = actor.items.find(item => item.data.name == "Large XP [3] Token")
        IncrementXpAndRemoveXpToken(actor, xpValue, largeXP)
    } else if (xpValue == 4) {
        let heroicXP = actor.items.find(item => item.data.name == "Heroic XP [4] Token")
        IncrementXpAndRemoveXpToken(actor, xpValue, heroicXP)
    } else if (xpValue == 5) {
        let legandaryXP = actor.items.find(item => item.data.name == "Legendary XP [5] Token")
        IncrementXpAndRemoveXpToken(actor, xpValue, legandaryXP)
    } else {
        console.log("PLEASE DEBUG THIS")
    }
}

async function IncrementXpAndRemoveXpToken(actor, xpValue, xpToken) {

    // Look for cheaters
    if (xpToken == null || xpToken == undefined) {
        console.log("You don't have any XP token, cheater")
        return;
    }

    // Decrement or Delete the XP Token
    await xpToken.update({"data.quantity": xpToken.data.data.quantity - 1});
    if (xpToken.data.data.quantity < 1) {
        xpToken.delete();
    }

    // Increment Actor's XP
    currentXP = actor.data.data.details.xp.value;
    await actor.update({"data.details.xp.value": currentXP + xpValue});
}