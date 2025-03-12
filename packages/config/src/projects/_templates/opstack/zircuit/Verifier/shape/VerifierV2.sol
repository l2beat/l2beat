// SPDX-License-Identifier: Unknown
pragma solidity 0.8.20;

contract VerifierV2 {
    bytes32 public constant digest = hex"1d544a5de23a23d1e94ae793352208593bfa28c3d76d455f09ea3f9c25c402b8";

    fallback(bytes calldata) external returns (bytes memory) {
        assembly ("memory-safe") {
            // Enforce that Solidity memory layout is respected
            let data := mload(0x40)
            if iszero(eq(data, 0x80)) { revert(0, 0) }

            let success := true
            let f_p := 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47
            let f_q := 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
            function validate_ec_point(x, y) -> valid {
                {
                    let x_lt_p := lt(x, 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47)
                    let y_lt_p := lt(y, 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47)
                    valid := and(x_lt_p, y_lt_p)
                }
                {
                    let y_square := mulmod(y, y, 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47)
                    let x_square := mulmod(x, x, 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47)
                    let x_cube :=
                        mulmod(x_square, x, 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47)
                    let x_cube_plus_3 :=
                        addmod(x_cube, 3, 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47)
                    let is_affine := eq(x_cube_plus_3, y_square)
                    valid := and(valid, is_affine)
                }
            }
            mstore(0x20, mod(calldataload(0x0), f_q))
            mstore(0x40, mod(calldataload(0x20), f_q))
            mstore(0x60, mod(calldataload(0x40), f_q))
            mstore(0x80, mod(calldataload(0x60), f_q))
            mstore(0xa0, mod(calldataload(0x80), f_q))
            mstore(0xc0, mod(calldataload(0xa0), f_q))
            mstore(0xe0, mod(calldataload(0xc0), f_q))
            mstore(0x100, mod(calldataload(0xe0), f_q))
            mstore(0x120, mod(calldataload(0x100), f_q))
            mstore(0x140, mod(calldataload(0x120), f_q))
            mstore(0x160, mod(calldataload(0x140), f_q))
            mstore(0x180, mod(calldataload(0x160), f_q))
            mstore(0x1a0, mod(calldataload(0x180), f_q))
            mstore(0x1c0, mod(calldataload(0x1a0), f_q))
            mstore(0x1e0, mod(calldataload(0x1c0), f_q))
            mstore(0x200, mod(calldataload(0x1e0), f_q))
            mstore(0x220, mod(calldataload(0x200), f_q))
            mstore(0x240, mod(calldataload(0x220), f_q))
            mstore(0x260, mod(calldataload(0x240), f_q))
            mstore(0x280, mod(calldataload(0x260), f_q))
            mstore(0x2a0, mod(calldataload(0x280), f_q))
            mstore(0x2c0, mod(calldataload(0x2a0), f_q))
            mstore(0x2e0, mod(calldataload(0x2c0), f_q))
            mstore(0x300, mod(calldataload(0x2e0), f_q))
            mstore(0x320, mod(calldataload(0x300), f_q))
            mstore(0x0, 16797158477944875835246464098104816482061895778796599669235069281799443306302)

            {
                let x := calldataload(0x320)
                mstore(0x340, x)
                let y := calldataload(0x340)
                mstore(0x360, y)
                success := and(validate_ec_point(x, y), success)
            }
            mstore(0x380, keccak256(0x0, 896))
            {
                let hash := mload(0x380)
                mstore(0x3a0, mod(hash, f_q))
                mstore(0x3c0, hash)
            }

            {
                let x := calldataload(0x360)
                mstore(0x3e0, x)
                let y := calldataload(0x380)
                mstore(0x400, y)
                success := and(validate_ec_point(x, y), success)
            }
            mstore(0x420, keccak256(0x3c0, 96))
            {
                let hash := mload(0x420)
                mstore(0x440, mod(hash, f_q))
                mstore(0x460, hash)
            }
            mstore8(1152, 1)
            mstore(0x480, keccak256(0x460, 33))
            {
                let hash := mload(0x480)
                mstore(0x4a0, mod(hash, f_q))
                mstore(0x4c0, hash)
            }

            {
                let x := calldataload(0x3a0)
                mstore(0x4e0, x)
                let y := calldataload(0x3c0)
                mstore(0x500, y)
                success := and(validate_ec_point(x, y), success)
            }

            {
                let x := calldataload(0x3e0)
                mstore(0x520, x)
                let y := calldataload(0x400)
                mstore(0x540, y)
                success := and(validate_ec_point(x, y), success)
            }

            {
                let x := calldataload(0x420)
                mstore(0x560, x)
                let y := calldataload(0x440)
                mstore(0x580, y)
                success := and(validate_ec_point(x, y), success)
            }
            mstore(0x5a0, keccak256(0x4c0, 224))
            {
                let hash := mload(0x5a0)
                mstore(0x5c0, mod(hash, f_q))
                mstore(0x5e0, hash)
            }

            {
                let x := calldataload(0x460)
                mstore(0x600, x)
                let y := calldataload(0x480)
                mstore(0x620, y)
                success := and(validate_ec_point(x, y), success)
            }

            {
                let x := calldataload(0x4a0)
                mstore(0x640, x)
                let y := calldataload(0x4c0)
                mstore(0x660, y)
                success := and(validate_ec_point(x, y), success)
            }

            {
                let x := calldataload(0x4e0)
                mstore(0x680, x)
                let y := calldataload(0x500)
                mstore(0x6a0, y)
                success := and(validate_ec_point(x, y), success)
            }

            {
                let x := calldataload(0x520)
                mstore(0x6c0, x)
                let y := calldataload(0x540)
                mstore(0x6e0, y)
                success := and(validate_ec_point(x, y), success)
            }
            mstore(0x700, keccak256(0x5e0, 288))
            {
                let hash := mload(0x700)
                mstore(0x720, mod(hash, f_q))
                mstore(0x740, hash)
            }
            mstore(0x760, mod(calldataload(0x560), f_q))
            mstore(0x780, mod(calldataload(0x580), f_q))
            mstore(0x7a0, mod(calldataload(0x5a0), f_q))
            mstore(0x7c0, mod(calldataload(0x5c0), f_q))
            mstore(0x7e0, mod(calldataload(0x5e0), f_q))
            mstore(0x800, mod(calldataload(0x600), f_q))
            mstore(0x820, mod(calldataload(0x620), f_q))
            mstore(0x840, mod(calldataload(0x640), f_q))
            mstore(0x860, mod(calldataload(0x660), f_q))
            mstore(0x880, mod(calldataload(0x680), f_q))
            mstore(0x8a0, mod(calldataload(0x6a0), f_q))
            mstore(0x8c0, mod(calldataload(0x6c0), f_q))
            mstore(0x8e0, mod(calldataload(0x6e0), f_q))
            mstore(0x900, mod(calldataload(0x700), f_q))
            mstore(0x920, mod(calldataload(0x720), f_q))
            mstore(0x940, mod(calldataload(0x740), f_q))
            mstore(0x960, mod(calldataload(0x760), f_q))
            mstore(0x980, keccak256(0x740, 576))
            {
                let hash := mload(0x980)
                mstore(0x9a0, mod(hash, f_q))
                mstore(0x9c0, hash)
            }
            mstore8(2528, 1)
            mstore(0x9e0, keccak256(0x9c0, 33))
            {
                let hash := mload(0x9e0)
                mstore(0xa00, mod(hash, f_q))
                mstore(0xa20, hash)
            }

            {
                let x := calldataload(0x780)
                mstore(0xa40, x)
                let y := calldataload(0x7a0)
                mstore(0xa60, y)
                success := and(validate_ec_point(x, y), success)
            }
            mstore(0xa80, keccak256(0xa20, 96))
            {
                let hash := mload(0xa80)
                mstore(0xaa0, mod(hash, f_q))
                mstore(0xac0, hash)
            }

            {
                let x := calldataload(0x7c0)
                mstore(0xae0, x)
                let y := calldataload(0x7e0)
                mstore(0xb00, y)
                success := and(validate_ec_point(x, y), success)
            }
            {
                let x := mload(0x20)
                x := add(x, shl(88, mload(0x40)))
                x := add(x, shl(176, mload(0x60)))
                mstore(2848, x)
                let y := mload(0x80)
                y := add(y, shl(88, mload(0xa0)))
                y := add(y, shl(176, mload(0xc0)))
                mstore(2880, y)

                success := and(validate_ec_point(x, y), success)
            }
            {
                let x := mload(0xe0)
                x := add(x, shl(88, mload(0x100)))
                x := add(x, shl(176, mload(0x120)))
                mstore(2912, x)
                let y := mload(0x140)
                y := add(y, shl(88, mload(0x160)))
                y := add(y, shl(176, mload(0x180)))
                mstore(2944, y)

                success := and(validate_ec_point(x, y), success)
            }
            mstore(0xba0, mulmod(mload(0x720), mload(0x720), f_q))
            mstore(0xbc0, mulmod(mload(0xba0), mload(0xba0), f_q))
            mstore(0xbe0, mulmod(mload(0xbc0), mload(0xbc0), f_q))
            mstore(0xc00, mulmod(mload(0xbe0), mload(0xbe0), f_q))
            mstore(0xc20, mulmod(mload(0xc00), mload(0xc00), f_q))
            mstore(0xc40, mulmod(mload(0xc20), mload(0xc20), f_q))
            mstore(0xc60, mulmod(mload(0xc40), mload(0xc40), f_q))
            mstore(0xc80, mulmod(mload(0xc60), mload(0xc60), f_q))
            mstore(0xca0, mulmod(mload(0xc80), mload(0xc80), f_q))
            mstore(0xcc0, mulmod(mload(0xca0), mload(0xca0), f_q))
            mstore(0xce0, mulmod(mload(0xcc0), mload(0xcc0), f_q))
            mstore(0xd00, mulmod(mload(0xce0), mload(0xce0), f_q))
            mstore(0xd20, mulmod(mload(0xd00), mload(0xd00), f_q))
            mstore(0xd40, mulmod(mload(0xd20), mload(0xd20), f_q))
            mstore(0xd60, mulmod(mload(0xd40), mload(0xd40), f_q))
            mstore(0xd80, mulmod(mload(0xd60), mload(0xd60), f_q))
            mstore(0xda0, mulmod(mload(0xd80), mload(0xd80), f_q))
            mstore(0xdc0, mulmod(mload(0xda0), mload(0xda0), f_q))
            mstore(0xde0, mulmod(mload(0xdc0), mload(0xdc0), f_q))
            mstore(0xe00, mulmod(mload(0xde0), mload(0xde0), f_q))
            mstore(0xe20, mulmod(mload(0xe00), mload(0xe00), f_q))
            mstore(0xe40, mulmod(mload(0xe20), mload(0xe20), f_q))
            mstore(0xe60, mulmod(mload(0xe40), mload(0xe40), f_q))
            mstore(0xe80, mulmod(mload(0xe60), mload(0xe60), f_q))
            mstore(0xea0, mulmod(mload(0xe80), mload(0xe80), f_q))
            mstore(0xec0, mulmod(mload(0xea0), mload(0xea0), f_q))
            mstore(
                0xee0,
                addmod(mload(0xec0), 21888242871839275222246405745257275088548364400416034343698204186575808495616, f_q)
            )
            mstore(
                0xf00,
                mulmod(mload(0xee0), 21888242545679039938882419398440172875981108180010270949818755658014750055173, f_q)
            )
            mstore(
                0xf20,
                mulmod(mload(0xf00), 20399963857427891121373969697480515951916080097087921832172879765607926713957, f_q)
            )
            mstore(
                0xf40,
                addmod(mload(0x720), 1488279014411384100872436047776759136632284303328112511525324420967881781660, f_q)
            )
            mstore(
                0xf60,
                mulmod(mload(0xf00), 16569469942529664681363945218228869388192121720036659574609237682362097667612, f_q)
            )
            mstore(
                0xf80,
                addmod(mload(0x720), 5318772929309610540882460527028405700356242680379374769088966504213710828005, f_q)
            )
            mstore(
                0xfa0,
                mulmod(mload(0xf00), 6047398202650739717314770882059679662647667807426525133977681644606291529311, f_q)
            )
            mstore(
                0xfc0,
                addmod(mload(0x720), 15840844669188535504931634863197595425900696592989509209720522541969516966306, f_q)
            )
            mstore(
                0xfe0,
                mulmod(mload(0xf00), 17329448237240114492580865744088056414251735686965494637158808787419781175510, f_q)
            )
            mstore(
                0x1000,
                addmod(mload(0x720), 4558794634599160729665540001169218674296628713450539706539395399156027320107, f_q)
            )
            mstore(
                0x1020,
                mulmod(mload(0xf00), 3693565015985198455139889557180396682968596245011005461846595820698933079918, f_q)
            )
            mstore(
                0x1040,
                addmod(mload(0x720), 18194677855854076767106516188076878405579768155405028881851608365876875415699, f_q)
            )
            mstore(
                0x1060,
                mulmod(mload(0xf00), 11377606117859914088982205826922132024839443553408109299929510653283289974216, f_q)
            )
            mstore(
                0x1080,
                addmod(mload(0x720), 10510636753979361133264199918335143063708920847007925043768693533292518521401, f_q)
            )
            mstore(
                0x10a0,
                mulmod(mload(0xf00), 14803907026430593724305438564799066516271154714737734572920456128449769927233, f_q)
            )
            mstore(
                0x10c0,
                addmod(mload(0x720), 7084335845408681497940967180458208572277209685678299770777748058126038568384, f_q)
            )
            mstore(0x10e0, mulmod(mload(0xf00), 1, f_q))
            mstore(
                0x1100,
                addmod(mload(0x720), 21888242871839275222246405745257275088548364400416034343698204186575808495616, f_q)
            )
            mstore(
                0x1120,
                mulmod(mload(0xf00), 13446667982376394161563610564587413125564757801019538732601045199901075958935, f_q)
            )
            mstore(
                0x1140,
                addmod(mload(0x720), 8441574889462881060682795180669861962983606599396495611097158986674732536682, f_q)
            )
            mstore(
                0x1160,
                mulmod(mload(0xf00), 6143038923529407703646399695489445107254060255791852207908457597807435305312, f_q)
            )
            mstore(
                0x1180,
                addmod(mload(0x720), 15745203948309867518600006049767829981294304144624182135789746588768373190305, f_q)
            )
            mstore(
                0x11a0,
                mulmod(mload(0xf00), 21813856626197829021720820945327074612555900476153638460378780375714815148448, f_q)
            )
            mstore(
                0x11c0,
                addmod(mload(0x720), 74386245641446200525584799930200475992463924262395883319423810860993347169, f_q)
            )
            mstore(
                0x11e0,
                mulmod(mload(0xf00), 11451405578697956743456240853980216273390554734748796433026540431386972584651, f_q)
            )
            mstore(
                0x1200,
                addmod(mload(0x720), 10436837293141318478790164891277058815157809665667237910671663755188835910966, f_q)
            )
            mstore(
                0x1220,
                mulmod(mload(0xf00), 2258791456229719674664876333845584462457126852136701862196747426485314788465, f_q)
            )
            mstore(
                0x1240,
                addmod(mload(0x720), 19629451415609555547581529411411690626091237548279332481501456760090493707152, f_q)
            )
            mstore(
                0x1260,
                mulmod(mload(0xf00), 16670521521732547392407716560529197273408943645332907966320731856743274895475, f_q)
            )
            mstore(
                0x1280,
                addmod(mload(0x720), 5217721350106727829838689184728077815139420755083126377377472329832533600142, f_q)
            )
            mstore(
                0x12a0,
                mulmod(mload(0xf00), 6973717477794544023251421539913937529504002186168239878624319939785647341572, f_q)
            )
            mstore(
                0x12c0,
                addmod(mload(0x720), 14914525394044731198994984205343337559044362214247794465073884246790161154045, f_q)
            )
            mstore(
                0x12e0,
                mulmod(mload(0xf00), 8374374965308410102411073611984011876711565317741801500439755773472076597347, f_q)
            )
            mstore(
                0x1300,
                addmod(mload(0x720), 13513867906530865119835332133273263211836799082674232843258448413103731898270, f_q)
            )
            mstore(
                0x1320,
                mulmod(mload(0xf00), 7644774028564064345188091774880429238758499926703297575879018755827411518744, f_q)
            )
            mstore(
                0x1340,
                addmod(mload(0x720), 14243468843275210877058313970376845849789864473712736767819185430748396976873, f_q)
            )
            mstore(
                0x1360,
                mulmod(mload(0xf00), 17041886618628883845743410343041491135676788197442345444346654338941897766515, f_q)
            )
            mstore(
                0x1380,
                addmod(mload(0x720), 4846356253210391376502995402215783952871576202973688899351549847633910729102, f_q)
            )
            mstore(
                0x13a0,
                mulmod(mload(0xf00), 20276212859876996965895067376549928325970197996069741985761123463478912375212, f_q)
            )
            mstore(
                0x13c0,
                addmod(mload(0x720), 1612030011962278256351338368707346762578166404346292357937080723096896120405, f_q)
            )
            mstore(
                0x13e0,
                mulmod(mload(0xf00), 21490807004895109926141140246143262403290679459142140821740925192625185504522, f_q)
            )
            mstore(
                0x1400,
                addmod(mload(0x720), 397435866944165296105265499114012685257684941273893521957278993950622991095, f_q)
            )
            mstore(
                0x1420,
                mulmod(mload(0xf00), 21856635360464150734248258901271514898436182748160009166613717095391832219001, f_q)
            )
            mstore(
                0x1440,
                addmod(mload(0x720), 31607511375124487998146843985760190112181652256025177084487091183976276616, f_q)
            )
            mstore(
                0x1460,
                mulmod(mload(0xf00), 4947689244094276630090796471410438387704819356682144196760515917874272844658, f_q)
            )
            mstore(
                0x1480,
                addmod(mload(0x720), 16940553627744998592155609273846836700843545043733890146937688268701535650959, f_q)
            )
            mstore(
                0x14a0,
                mulmod(mload(0xf00), 16070949257099864401214446952969046546611226673215562325034009111680440277863, f_q)
            )
            mstore(
                0x14c0,
                addmod(mload(0x720), 5817293614739410821031958792288228541937137727200472018664195074895368217754, f_q)
            )
            mstore(
                0x14e0,
                mulmod(mload(0xf00), 11211301017135681023579411905410872569206244553457844956874280139879520583390, f_q)
            )
            mstore(
                0x1500,
                addmod(mload(0x720), 10676941854703594198666993839846402519342119846958189386823924046696287912227, f_q)
            )
            mstore(
                0x1520,
                mulmod(mload(0xf00), 13950560640343059709470007801605358008980413716864447750775614801472024994001, f_q)
            )
            mstore(
                0x1540,
                addmod(mload(0x720), 7937682231496215512776397943651917079567950683551586592922589385103783501616, f_q)
            )
            mstore(
                0x1560,
                mulmod(mload(0xf00), 5264024894212359361117235356180248560912605977787414341366976252256241723081, f_q)
            )
            mstore(
                0x1580,
                addmod(mload(0x720), 16624217977626915861129170389077026527635758422628620002331227934319566772536, f_q)
            )
            mstore(
                0x15a0,
                mulmod(mload(0xf00), 3625492050666108396704456638133783157286349416935200203472288366641355665864, f_q)
            )
            mstore(
                0x15c0,
                addmod(mload(0x720), 18262750821173166825541949107123491931262014983480834140225915819934452829753, f_q)
            )
            mstore(
                0x15e0,
                mulmod(mload(0xf00), 18846108080730935585192484934247867403156699586319724728525857970312957475341, f_q)
            )
            mstore(
                0x1600,
                addmod(mload(0x720), 3042134791108339637053920811009407685391664814096309615172346216262851020276, f_q)
            )
            mstore(
                0x1620,
                mulmod(mload(0xf00), 6473332732845625289791651727472817517565982136597666101608581856093617811346, f_q)
            )
            mstore(
                0x1640,
                addmod(mload(0x720), 15414910138993649932454754017784457570982382263818368242089622330482190684271, f_q)
            )
            mstore(
                0x1660,
                mulmod(mload(0xf00), 14702679338564370535199761954906750181917994561807919001424434650417511039135, f_q)
            )
            mstore(
                0x1680,
                addmod(mload(0x720), 7185563533274904687046643790350524906630369838608115342273769536158297456482, f_q)
            )
            mstore(
                0x16a0,
                mulmod(mload(0xf00), 6001486148891510551408340246911394095022311837824516338589673764885721480362, f_q)
            )
            mstore(
                0x16c0,
                addmod(mload(0x720), 15886756722947764670838065498345880993526052562591518005108530421690087015255, f_q)
            )
            mstore(
                0x16e0,
                mulmod(mload(0xf00), 3615478808282855240548287271348143516886772452944084747768312988864436725401, f_q)
            )
            mstore(
                0x1700,
                addmod(mload(0x720), 18272764063556419981698118473909131571661591947471949595929891197711371770216, f_q)
            )
            {
                let prod := mload(0xf40)

                prod := mulmod(mload(0xf80), prod, f_q)
                mstore(0x1720, prod)

                prod := mulmod(mload(0xfc0), prod, f_q)
                mstore(0x1740, prod)

                prod := mulmod(mload(0x1000), prod, f_q)
                mstore(0x1760, prod)

                prod := mulmod(mload(0x1040), prod, f_q)
                mstore(0x1780, prod)

                prod := mulmod(mload(0x1080), prod, f_q)
                mstore(0x17a0, prod)

                prod := mulmod(mload(0x10c0), prod, f_q)
                mstore(0x17c0, prod)

                prod := mulmod(mload(0x1100), prod, f_q)
                mstore(0x17e0, prod)

                prod := mulmod(mload(0x1140), prod, f_q)
                mstore(0x1800, prod)

                prod := mulmod(mload(0x1180), prod, f_q)
                mstore(0x1820, prod)

                prod := mulmod(mload(0x11c0), prod, f_q)
                mstore(0x1840, prod)

                prod := mulmod(mload(0x1200), prod, f_q)
                mstore(0x1860, prod)

                prod := mulmod(mload(0x1240), prod, f_q)
                mstore(0x1880, prod)

                prod := mulmod(mload(0x1280), prod, f_q)
                mstore(0x18a0, prod)

                prod := mulmod(mload(0x12c0), prod, f_q)
                mstore(0x18c0, prod)

                prod := mulmod(mload(0x1300), prod, f_q)
                mstore(0x18e0, prod)

                prod := mulmod(mload(0x1340), prod, f_q)
                mstore(0x1900, prod)

                prod := mulmod(mload(0x1380), prod, f_q)
                mstore(0x1920, prod)

                prod := mulmod(mload(0x13c0), prod, f_q)
                mstore(0x1940, prod)

                prod := mulmod(mload(0x1400), prod, f_q)
                mstore(0x1960, prod)

                prod := mulmod(mload(0x1440), prod, f_q)
                mstore(0x1980, prod)

                prod := mulmod(mload(0x1480), prod, f_q)
                mstore(0x19a0, prod)

                prod := mulmod(mload(0x14c0), prod, f_q)
                mstore(0x19c0, prod)

                prod := mulmod(mload(0x1500), prod, f_q)
                mstore(0x19e0, prod)

                prod := mulmod(mload(0x1540), prod, f_q)
                mstore(0x1a00, prod)

                prod := mulmod(mload(0x1580), prod, f_q)
                mstore(0x1a20, prod)

                prod := mulmod(mload(0x15c0), prod, f_q)
                mstore(0x1a40, prod)

                prod := mulmod(mload(0x1600), prod, f_q)
                mstore(0x1a60, prod)

                prod := mulmod(mload(0x1640), prod, f_q)
                mstore(0x1a80, prod)

                prod := mulmod(mload(0x1680), prod, f_q)
                mstore(0x1aa0, prod)

                prod := mulmod(mload(0x16c0), prod, f_q)
                mstore(0x1ac0, prod)

                prod := mulmod(mload(0x1700), prod, f_q)
                mstore(0x1ae0, prod)

                prod := mulmod(mload(0xee0), prod, f_q)
                mstore(0x1b00, prod)
            }
            mstore(0x1b40, 32)
            mstore(0x1b60, 32)
            mstore(0x1b80, 32)
            mstore(0x1ba0, mload(0x1b00))
            mstore(0x1bc0, 21888242871839275222246405745257275088548364400416034343698204186575808495615)
            mstore(0x1be0, 21888242871839275222246405745257275088548364400416034343698204186575808495617)
            success := and(eq(staticcall(gas(), 0x5, 0x1b40, 0xc0, 0x1b20, 0x20), 1), success)
            {
                let inv := mload(0x1b20)
                let v

                v := mload(0xee0)
                mstore(3808, mulmod(mload(0x1ae0), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1700)
                mstore(5888, mulmod(mload(0x1ac0), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x16c0)
                mstore(5824, mulmod(mload(0x1aa0), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1680)
                mstore(5760, mulmod(mload(0x1a80), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1640)
                mstore(5696, mulmod(mload(0x1a60), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1600)
                mstore(5632, mulmod(mload(0x1a40), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x15c0)
                mstore(5568, mulmod(mload(0x1a20), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1580)
                mstore(5504, mulmod(mload(0x1a00), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1540)
                mstore(5440, mulmod(mload(0x19e0), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1500)
                mstore(5376, mulmod(mload(0x19c0), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x14c0)
                mstore(5312, mulmod(mload(0x19a0), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1480)
                mstore(5248, mulmod(mload(0x1980), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1440)
                mstore(5184, mulmod(mload(0x1960), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1400)
                mstore(5120, mulmod(mload(0x1940), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x13c0)
                mstore(5056, mulmod(mload(0x1920), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1380)
                mstore(4992, mulmod(mload(0x1900), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1340)
                mstore(4928, mulmod(mload(0x18e0), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1300)
                mstore(4864, mulmod(mload(0x18c0), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x12c0)
                mstore(4800, mulmod(mload(0x18a0), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1280)
                mstore(4736, mulmod(mload(0x1880), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1240)
                mstore(4672, mulmod(mload(0x1860), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1200)
                mstore(4608, mulmod(mload(0x1840), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x11c0)
                mstore(4544, mulmod(mload(0x1820), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1180)
                mstore(4480, mulmod(mload(0x1800), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1140)
                mstore(4416, mulmod(mload(0x17e0), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1100)
                mstore(4352, mulmod(mload(0x17c0), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x10c0)
                mstore(4288, mulmod(mload(0x17a0), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1080)
                mstore(4224, mulmod(mload(0x1780), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1040)
                mstore(4160, mulmod(mload(0x1760), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x1000)
                mstore(4096, mulmod(mload(0x1740), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0xfc0)
                mstore(4032, mulmod(mload(0x1720), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0xf80)
                mstore(3968, mulmod(mload(0xf40), inv, f_q))
                inv := mulmod(v, inv, f_q)
                mstore(0xf40, inv)
            }
            mstore(0x1c00, mulmod(mload(0xf20), mload(0xf40), f_q))
            mstore(0x1c20, mulmod(mload(0xf60), mload(0xf80), f_q))
            mstore(0x1c40, mulmod(mload(0xfa0), mload(0xfc0), f_q))
            mstore(0x1c60, mulmod(mload(0xfe0), mload(0x1000), f_q))
            mstore(0x1c80, mulmod(mload(0x1020), mload(0x1040), f_q))
            mstore(0x1ca0, mulmod(mload(0x1060), mload(0x1080), f_q))
            mstore(0x1cc0, mulmod(mload(0x10a0), mload(0x10c0), f_q))
            mstore(0x1ce0, mulmod(mload(0x10e0), mload(0x1100), f_q))
            mstore(0x1d00, mulmod(mload(0x1120), mload(0x1140), f_q))
            mstore(0x1d20, mulmod(mload(0x1160), mload(0x1180), f_q))
            mstore(0x1d40, mulmod(mload(0x11a0), mload(0x11c0), f_q))
            mstore(0x1d60, mulmod(mload(0x11e0), mload(0x1200), f_q))
            mstore(0x1d80, mulmod(mload(0x1220), mload(0x1240), f_q))
            mstore(0x1da0, mulmod(mload(0x1260), mload(0x1280), f_q))
            mstore(0x1dc0, mulmod(mload(0x12a0), mload(0x12c0), f_q))
            mstore(0x1de0, mulmod(mload(0x12e0), mload(0x1300), f_q))
            mstore(0x1e00, mulmod(mload(0x1320), mload(0x1340), f_q))
            mstore(0x1e20, mulmod(mload(0x1360), mload(0x1380), f_q))
            mstore(0x1e40, mulmod(mload(0x13a0), mload(0x13c0), f_q))
            mstore(0x1e60, mulmod(mload(0x13e0), mload(0x1400), f_q))
            mstore(0x1e80, mulmod(mload(0x1420), mload(0x1440), f_q))
            mstore(0x1ea0, mulmod(mload(0x1460), mload(0x1480), f_q))
            mstore(0x1ec0, mulmod(mload(0x14a0), mload(0x14c0), f_q))
            mstore(0x1ee0, mulmod(mload(0x14e0), mload(0x1500), f_q))
            mstore(0x1f00, mulmod(mload(0x1520), mload(0x1540), f_q))
            mstore(0x1f20, mulmod(mload(0x1560), mload(0x1580), f_q))
            mstore(0x1f40, mulmod(mload(0x15a0), mload(0x15c0), f_q))
            mstore(0x1f60, mulmod(mload(0x15e0), mload(0x1600), f_q))
            mstore(0x1f80, mulmod(mload(0x1620), mload(0x1640), f_q))
            mstore(0x1fa0, mulmod(mload(0x1660), mload(0x1680), f_q))
            mstore(0x1fc0, mulmod(mload(0x16a0), mload(0x16c0), f_q))
            mstore(0x1fe0, mulmod(mload(0x16e0), mload(0x1700), f_q))
            {
                let result := mulmod(mload(0x1ce0), mload(0x20), f_q)
                result := addmod(mulmod(mload(0x1d00), mload(0x40), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1d20), mload(0x60), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1d40), mload(0x80), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1d60), mload(0xa0), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1d80), mload(0xc0), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1da0), mload(0xe0), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1dc0), mload(0x100), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1de0), mload(0x120), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1e00), mload(0x140), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1e20), mload(0x160), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1e40), mload(0x180), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1e60), mload(0x1a0), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1e80), mload(0x1c0), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1ea0), mload(0x1e0), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1ec0), mload(0x200), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1ee0), mload(0x220), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1f00), mload(0x240), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1f20), mload(0x260), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1f40), mload(0x280), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1f60), mload(0x2a0), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1f80), mload(0x2c0), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1fa0), mload(0x2e0), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1fc0), mload(0x300), f_q), result, f_q)
                result := addmod(mulmod(mload(0x1fe0), mload(0x320), f_q), result, f_q)
                mstore(8192, result)
            }
            mstore(0x2020, mulmod(mload(0x7a0), mload(0x780), f_q))
            mstore(0x2040, addmod(mload(0x760), mload(0x2020), f_q))
            mstore(0x2060, addmod(mload(0x2040), sub(f_q, mload(0x7c0)), f_q))
            mstore(0x2080, mulmod(mload(0x2060), mload(0x820), f_q))
            mstore(0x20a0, mulmod(mload(0x5c0), mload(0x2080), f_q))
            mstore(0x20c0, addmod(1, sub(f_q, mload(0x8e0)), f_q))
            mstore(0x20e0, mulmod(mload(0x20c0), mload(0x1ce0), f_q))
            mstore(0x2100, addmod(mload(0x20a0), mload(0x20e0), f_q))
            mstore(0x2120, mulmod(mload(0x5c0), mload(0x2100), f_q))
            mstore(0x2140, mulmod(mload(0x8e0), mload(0x8e0), f_q))
            mstore(0x2160, addmod(mload(0x2140), sub(f_q, mload(0x8e0)), f_q))
            mstore(0x2180, mulmod(mload(0x2160), mload(0x1c00), f_q))
            mstore(0x21a0, addmod(mload(0x2120), mload(0x2180), f_q))
            mstore(0x21c0, mulmod(mload(0x5c0), mload(0x21a0), f_q))
            mstore(0x21e0, addmod(1, sub(f_q, mload(0x1c00)), f_q))
            mstore(0x2200, addmod(mload(0x1c20), mload(0x1c40), f_q))
            mstore(0x2220, addmod(mload(0x2200), mload(0x1c60), f_q))
            mstore(0x2240, addmod(mload(0x2220), mload(0x1c80), f_q))
            mstore(0x2260, addmod(mload(0x2240), mload(0x1ca0), f_q))
            mstore(0x2280, addmod(mload(0x2260), mload(0x1cc0), f_q))
            mstore(0x22a0, addmod(mload(0x21e0), sub(f_q, mload(0x2280)), f_q))
            mstore(0x22c0, mulmod(mload(0x880), mload(0x440), f_q))
            mstore(0x22e0, addmod(mload(0x7e0), mload(0x22c0), f_q))
            mstore(0x2300, addmod(mload(0x22e0), mload(0x4a0), f_q))
            mstore(0x2320, mulmod(mload(0x8a0), mload(0x440), f_q))
            mstore(0x2340, addmod(mload(0x760), mload(0x2320), f_q))
            mstore(0x2360, addmod(mload(0x2340), mload(0x4a0), f_q))
            mstore(0x2380, mulmod(mload(0x2360), mload(0x2300), f_q))
            mstore(0x23a0, mulmod(mload(0x8c0), mload(0x440), f_q))
            mstore(0x23c0, addmod(mload(0x2000), mload(0x23a0), f_q))
            mstore(0x23e0, addmod(mload(0x23c0), mload(0x4a0), f_q))
            mstore(0x2400, mulmod(mload(0x23e0), mload(0x2380), f_q))
            mstore(0x2420, mulmod(mload(0x2400), mload(0x900), f_q))
            mstore(0x2440, mulmod(1, mload(0x440), f_q))
            mstore(0x2460, mulmod(mload(0x720), mload(0x2440), f_q))
            mstore(0x2480, addmod(mload(0x7e0), mload(0x2460), f_q))
            mstore(0x24a0, addmod(mload(0x2480), mload(0x4a0), f_q))
            mstore(
                0x24c0,
                mulmod(4131629893567559867359510883348571134090853742863529169391034518566172092834, mload(0x440), f_q)
            )
            mstore(0x24e0, mulmod(mload(0x720), mload(0x24c0), f_q))
            mstore(0x2500, addmod(mload(0x760), mload(0x24e0), f_q))
            mstore(0x2520, addmod(mload(0x2500), mload(0x4a0), f_q))
            mstore(0x2540, mulmod(mload(0x2520), mload(0x24a0), f_q))
            mstore(
                0x2560,
                mulmod(8910878055287538404433155982483128285667088683464058436815641868457422632747, mload(0x440), f_q)
            )
            mstore(0x2580, mulmod(mload(0x720), mload(0x2560), f_q))
            mstore(0x25a0, addmod(mload(0x2000), mload(0x2580), f_q))
            mstore(0x25c0, addmod(mload(0x25a0), mload(0x4a0), f_q))
            mstore(0x25e0, mulmod(mload(0x25c0), mload(0x2540), f_q))
            mstore(0x2600, mulmod(mload(0x25e0), mload(0x8e0), f_q))
            mstore(0x2620, addmod(mload(0x2420), sub(f_q, mload(0x2600)), f_q))
            mstore(0x2640, mulmod(mload(0x2620), mload(0x22a0), f_q))
            mstore(0x2660, addmod(mload(0x21c0), mload(0x2640), f_q))
            mstore(0x2680, mulmod(mload(0x5c0), mload(0x2660), f_q))
            mstore(0x26a0, mulmod(mload(0x920), mload(0x1ce0), f_q))
            mstore(0x26c0, addmod(mload(0x2680), mload(0x26a0), f_q))
            mstore(0x26e0, mulmod(mload(0x5c0), mload(0x26c0), f_q))
            mstore(0x2700, mulmod(mload(0x920), mload(0x1c00), f_q))
            mstore(0x2720, addmod(mload(0x26e0), mload(0x2700), f_q))
            mstore(0x2740, mulmod(mload(0x5c0), mload(0x2720), f_q))
            mstore(0x2760, addmod(mload(0x800), mload(0x440), f_q))
            mstore(0x2780, mulmod(mload(0x760), mload(0x840), f_q))
            mstore(0x27a0, addmod(mload(0x2780), mload(0x440), f_q))
            mstore(0x27c0, mulmod(mload(0x27a0), mload(0x2760), f_q))
            mstore(0x27e0, addmod(mload(0x940), sub(f_q, mload(0x920)), f_q))
            mstore(0x2800, mulmod(mload(0x27e0), mload(0x27c0), f_q))
            mstore(0x2820, mulmod(mload(0x27a0), mload(0x960), f_q))
            mstore(0x2840, addmod(mload(0x2760), sub(f_q, mload(0x2820)), f_q))
            mstore(0x2860, addmod(mload(0x2800), sub(f_q, mload(0x2840)), f_q))
            mstore(0x2880, mulmod(mload(0x2860), mload(0x22a0), f_q))
            mstore(0x28a0, addmod(mload(0x2740), mload(0x2880), f_q))
            mstore(0x28c0, mulmod(mload(0xec0), mload(0xec0), f_q))
            mstore(0x28e0, mulmod(mload(0x28c0), mload(0xec0), f_q))
            mstore(0x2900, mulmod(mload(0x28e0), mload(0xec0), f_q))
            mstore(0x2920, mulmod(1, mload(0xec0), f_q))
            mstore(0x2940, mulmod(1, mload(0x28c0), f_q))
            mstore(0x2960, mulmod(1, mload(0x28e0), f_q))
            mstore(0x2980, mulmod(mload(0x28a0), mload(0xee0), f_q))
            mstore(0x29a0, mulmod(mload(0xba0), mload(0x720), f_q))
            mstore(0x29c0, mulmod(mload(0x720), 1, f_q))
            mstore(0x29e0, addmod(mload(0xaa0), sub(f_q, mload(0x29c0)), f_q))
            mstore(
                0x2a00,
                mulmod(mload(0x720), 6143038923529407703646399695489445107254060255791852207908457597807435305312, f_q)
            )
            mstore(0x2a20, addmod(mload(0xaa0), sub(f_q, mload(0x2a00)), f_q))
            mstore(
                0x2a40,
                mulmod(mload(0x720), 13446667982376394161563610564587413125564757801019538732601045199901075958935, f_q)
            )
            mstore(0x2a60, addmod(mload(0xaa0), sub(f_q, mload(0x2a40)), f_q))
            mstore(
                0x2a80,
                mulmod(mload(0x720), 21813856626197829021720820945327074612555900476153638460378780375714815148448, f_q)
            )
            mstore(0x2aa0, addmod(mload(0xaa0), sub(f_q, mload(0x2a80)), f_q))
            {
                let result :=
                    mulmod(mload(0xaa0), 21226454350967877604996201857734295406716648685573268075789461576572118204629, f_q)
                result :=
                    addmod(
                        mulmod(
                            mload(0x720), 661788520871397617250203887522979681831715714842766267908742610003690290988, f_q
                        ),
                        result,
                        f_q
                    )
                mstore(10944, result)
            }
            {
                let result :=
                    mulmod(mload(0xaa0), 5861127194460807938380394597488182289255701836742860267379931784243223318895, f_q)
                result :=
                    addmod(
                        mulmod(
                            mload(0x720), 3390128162633191074125945073253823994540311710737587304644639100065963932907, f_q
                        ),
                        result,
                        f_q
                    )
                mstore(10976, result)
            }
            {
                let result :=
                    mulmod(mload(0xaa0), 3390128162633191074125945073253823994540311710737587304644639100065963932907, f_q)
                result :=
                    addmod(
                        mulmod(
                            mload(0x720), 90032813343344028270095592867940481147765329332774301746019309308684830918, f_q
                        ),
                        result,
                        f_q
                    )
                mstore(11008, result)
            }
            {
                let result :=
                    mulmod(mload(0xaa0), 6081264866030232838172298610738481044383077933941150375357654711302968300110, f_q)
                result :=
                    addmod(
                        mulmod(
                            mload(0x720), 17149721552240364152242558882079404925549682875792813195623508753281175593761, f_q
                        ),
                        result,
                        f_q
                    )
                mstore(11040, result)
            }
            mstore(0x2b40, mulmod(1, mload(0x29e0), f_q))
            mstore(0x2b60, mulmod(mload(0x2b40), mload(0x2a60), f_q))
            mstore(0x2b80, mulmod(mload(0x2b60), mload(0x2a20), f_q))
            mstore(0x2ba0, mulmod(mload(0x2b80), mload(0x2aa0), f_q))
            {
                let result :=
                    mulmod(mload(0xaa0), 8441574889462881060682795180669861962983606599396495611097158986674732536683, f_q)
                result :=
                    addmod(
                        mulmod(
                            mload(0x720), 13446667982376394161563610564587413125564757801019538732601045199901075958934, f_q
                        ),
                        result,
                        f_q
                    )
                mstore(11200, result)
            }
            {
                let result :=
                    mulmod(mload(0xaa0), 13446667982376394161563610564587413125564757801019538732601045199901075958934, f_q)
                result :=
                    addmod(
                        mulmod(
                            mload(0x720), 7303629058846986457917210869097968018310697545227686524692587602093640653623, f_q
                        ),
                        result,
                        f_q
                    )
                mstore(11232, result)
            }
            {
                let result := mulmod(mload(0xaa0), 1, f_q)
                result :=
                    addmod(
                        mulmod(
                            mload(0x720), 21888242871839275222246405745257275088548364400416034343698204186575808495616, f_q
                        ),
                        result,
                        f_q
                    )
                mstore(11264, result)
            }
            {
                let prod := mload(0x2ac0)

                prod := mulmod(mload(0x2ae0), prod, f_q)
                mstore(0x2c20, prod)

                prod := mulmod(mload(0x2b00), prod, f_q)
                mstore(0x2c40, prod)

                prod := mulmod(mload(0x2b20), prod, f_q)
                mstore(0x2c60, prod)

                prod := mulmod(mload(0x2bc0), prod, f_q)
                mstore(0x2c80, prod)

                prod := mulmod(mload(0x2be0), prod, f_q)
                mstore(0x2ca0, prod)

                prod := mulmod(mload(0x2b60), prod, f_q)
                mstore(0x2cc0, prod)

                prod := mulmod(mload(0x2c00), prod, f_q)
                mstore(0x2ce0, prod)

                prod := mulmod(mload(0x2b40), prod, f_q)
                mstore(0x2d00, prod)
            }
            mstore(0x2d40, 32)
            mstore(0x2d60, 32)
            mstore(0x2d80, 32)
            mstore(0x2da0, mload(0x2d00))
            mstore(0x2dc0, 21888242871839275222246405745257275088548364400416034343698204186575808495615)
            mstore(0x2de0, 21888242871839275222246405745257275088548364400416034343698204186575808495617)
            success := and(eq(staticcall(gas(), 0x5, 0x2d40, 0xc0, 0x2d20, 0x20), 1), success)
            {
                let inv := mload(0x2d20)
                let v

                v := mload(0x2b40)
                mstore(11072, mulmod(mload(0x2ce0), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x2c00)
                mstore(11264, mulmod(mload(0x2cc0), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x2b60)
                mstore(11104, mulmod(mload(0x2ca0), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x2be0)
                mstore(11232, mulmod(mload(0x2c80), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x2bc0)
                mstore(11200, mulmod(mload(0x2c60), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x2b20)
                mstore(11040, mulmod(mload(0x2c40), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x2b00)
                mstore(11008, mulmod(mload(0x2c20), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x2ae0)
                mstore(10976, mulmod(mload(0x2ac0), inv, f_q))
                inv := mulmod(v, inv, f_q)
                mstore(0x2ac0, inv)
            }
            {
                let result := mload(0x2ac0)
                result := addmod(mload(0x2ae0), result, f_q)
                result := addmod(mload(0x2b00), result, f_q)
                result := addmod(mload(0x2b20), result, f_q)
                mstore(11776, result)
            }
            mstore(0x2e20, mulmod(mload(0x2ba0), mload(0x2b60), f_q))
            {
                let result := mload(0x2bc0)
                result := addmod(mload(0x2be0), result, f_q)
                mstore(11840, result)
            }
            mstore(0x2e60, mulmod(mload(0x2ba0), mload(0x2b40), f_q))
            {
                let result := mload(0x2c00)
                mstore(11904, result)
            }
            {
                let prod := mload(0x2e00)

                prod := mulmod(mload(0x2e40), prod, f_q)
                mstore(0x2ea0, prod)

                prod := mulmod(mload(0x2e80), prod, f_q)
                mstore(0x2ec0, prod)
            }
            mstore(0x2f00, 32)
            mstore(0x2f20, 32)
            mstore(0x2f40, 32)
            mstore(0x2f60, mload(0x2ec0))
            mstore(0x2f80, 21888242871839275222246405745257275088548364400416034343698204186575808495615)
            mstore(0x2fa0, 21888242871839275222246405745257275088548364400416034343698204186575808495617)
            success := and(eq(staticcall(gas(), 0x5, 0x2f00, 0xc0, 0x2ee0, 0x20), 1), success)
            {
                let inv := mload(0x2ee0)
                let v

                v := mload(0x2e80)
                mstore(11904, mulmod(mload(0x2ea0), inv, f_q))
                inv := mulmod(v, inv, f_q)

                v := mload(0x2e40)
                mstore(11840, mulmod(mload(0x2e00), inv, f_q))
                inv := mulmod(v, inv, f_q)
                mstore(0x2e00, inv)
            }
            mstore(0x2fc0, mulmod(mload(0x2e20), mload(0x2e40), f_q))
            mstore(0x2fe0, mulmod(mload(0x2e60), mload(0x2e80), f_q))
            mstore(0x3000, mulmod(mload(0x9a0), mload(0x9a0), f_q))
            mstore(0x3020, mulmod(mload(0x3000), mload(0x9a0), f_q))
            mstore(0x3040, mulmod(mload(0x3020), mload(0x9a0), f_q))
            mstore(0x3060, mulmod(mload(0x3040), mload(0x9a0), f_q))
            mstore(0x3080, mulmod(mload(0x3060), mload(0x9a0), f_q))
            mstore(0x30a0, mulmod(mload(0x3080), mload(0x9a0), f_q))
            mstore(0x30c0, mulmod(mload(0x30a0), mload(0x9a0), f_q))
            mstore(0x30e0, mulmod(mload(0x30c0), mload(0x9a0), f_q))
            mstore(0x3100, mulmod(mload(0x30e0), mload(0x9a0), f_q))
            mstore(0x3120, mulmod(mload(0xa00), mload(0xa00), f_q))
            mstore(0x3140, mulmod(mload(0x3120), mload(0xa00), f_q))
            {
                let result := mulmod(mload(0x760), mload(0x2ac0), f_q)
                result := addmod(mulmod(mload(0x780), mload(0x2ae0), f_q), result, f_q)
                result := addmod(mulmod(mload(0x7a0), mload(0x2b00), f_q), result, f_q)
                result := addmod(mulmod(mload(0x7c0), mload(0x2b20), f_q), result, f_q)
                mstore(12640, result)
            }
            mstore(0x3180, mulmod(mload(0x3160), mload(0x2e00), f_q))
            mstore(0x31a0, mulmod(sub(f_q, mload(0x3180)), 1, f_q))
            mstore(0x31c0, mulmod(mload(0x31a0), 1, f_q))
            mstore(0x31e0, mulmod(1, mload(0x2e20), f_q))
            {
                let result := mulmod(mload(0x8e0), mload(0x2bc0), f_q)
                result := addmod(mulmod(mload(0x900), mload(0x2be0), f_q), result, f_q)
                mstore(12800, result)
            }
            mstore(0x3220, mulmod(mload(0x3200), mload(0x2fc0), f_q))
            mstore(0x3240, mulmod(sub(f_q, mload(0x3220)), 1, f_q))
            mstore(0x3260, mulmod(mload(0x31e0), 1, f_q))
            {
                let result := mulmod(mload(0x920), mload(0x2bc0), f_q)
                result := addmod(mulmod(mload(0x940), mload(0x2be0), f_q), result, f_q)
                mstore(12928, result)
            }
            mstore(0x32a0, mulmod(mload(0x3280), mload(0x2fc0), f_q))
            mstore(0x32c0, mulmod(sub(f_q, mload(0x32a0)), mload(0x9a0), f_q))
            mstore(0x32e0, mulmod(mload(0x31e0), mload(0x9a0), f_q))
            mstore(0x3300, addmod(mload(0x3240), mload(0x32c0), f_q))
            mstore(0x3320, mulmod(mload(0x3300), mload(0xa00), f_q))
            mstore(0x3340, mulmod(mload(0x3260), mload(0xa00), f_q))
            mstore(0x3360, mulmod(mload(0x32e0), mload(0xa00), f_q))
            mstore(0x3380, addmod(mload(0x31c0), mload(0x3320), f_q))
            mstore(0x33a0, mulmod(1, mload(0x2e60), f_q))
            {
                let result := mulmod(mload(0x960), mload(0x2c00), f_q)
                mstore(13248, result)
            }
            mstore(0x33e0, mulmod(mload(0x33c0), mload(0x2fe0), f_q))
            mstore(0x3400, mulmod(sub(f_q, mload(0x33e0)), 1, f_q))
            mstore(0x3420, mulmod(mload(0x33a0), 1, f_q))
            {
                let result := mulmod(mload(0x7e0), mload(0x2c00), f_q)
                mstore(13376, result)
            }
            mstore(0x3460, mulmod(mload(0x3440), mload(0x2fe0), f_q))
            mstore(0x3480, mulmod(sub(f_q, mload(0x3460)), mload(0x9a0), f_q))
            mstore(0x34a0, mulmod(mload(0x33a0), mload(0x9a0), f_q))
            mstore(0x34c0, addmod(mload(0x3400), mload(0x3480), f_q))
            {
                let result := mulmod(mload(0x800), mload(0x2c00), f_q)
                mstore(13536, result)
            }
            mstore(0x3500, mulmod(mload(0x34e0), mload(0x2fe0), f_q))
            mstore(0x3520, mulmod(sub(f_q, mload(0x3500)), mload(0x3000), f_q))
            mstore(0x3540, mulmod(mload(0x33a0), mload(0x3000), f_q))
            mstore(0x3560, addmod(mload(0x34c0), mload(0x3520), f_q))
            {
                let result := mulmod(mload(0x820), mload(0x2c00), f_q)
                mstore(13696, result)
            }
            mstore(0x35a0, mulmod(mload(0x3580), mload(0x2fe0), f_q))
            mstore(0x35c0, mulmod(sub(f_q, mload(0x35a0)), mload(0x3020), f_q))
            mstore(0x35e0, mulmod(mload(0x33a0), mload(0x3020), f_q))
            mstore(0x3600, addmod(mload(0x3560), mload(0x35c0), f_q))
            {
                let result := mulmod(mload(0x840), mload(0x2c00), f_q)
                mstore(13856, result)
            }
            mstore(0x3640, mulmod(mload(0x3620), mload(0x2fe0), f_q))
            mstore(0x3660, mulmod(sub(f_q, mload(0x3640)), mload(0x3040), f_q))
            mstore(0x3680, mulmod(mload(0x33a0), mload(0x3040), f_q))
            mstore(0x36a0, addmod(mload(0x3600), mload(0x3660), f_q))
            {
                let result := mulmod(mload(0x880), mload(0x2c00), f_q)
                mstore(14016, result)
            }
            mstore(0x36e0, mulmod(mload(0x36c0), mload(0x2fe0), f_q))
            mstore(0x3700, mulmod(sub(f_q, mload(0x36e0)), mload(0x3060), f_q))
            mstore(0x3720, mulmod(mload(0x33a0), mload(0x3060), f_q))
            mstore(0x3740, addmod(mload(0x36a0), mload(0x3700), f_q))
            {
                let result := mulmod(mload(0x8a0), mload(0x2c00), f_q)
                mstore(14176, result)
            }
            mstore(0x3780, mulmod(mload(0x3760), mload(0x2fe0), f_q))
            mstore(0x37a0, mulmod(sub(f_q, mload(0x3780)), mload(0x3080), f_q))
            mstore(0x37c0, mulmod(mload(0x33a0), mload(0x3080), f_q))
            mstore(0x37e0, addmod(mload(0x3740), mload(0x37a0), f_q))
            {
                let result := mulmod(mload(0x8c0), mload(0x2c00), f_q)
                mstore(14336, result)
            }
            mstore(0x3820, mulmod(mload(0x3800), mload(0x2fe0), f_q))
            mstore(0x3840, mulmod(sub(f_q, mload(0x3820)), mload(0x30a0), f_q))
            mstore(0x3860, mulmod(mload(0x33a0), mload(0x30a0), f_q))
            mstore(0x3880, addmod(mload(0x37e0), mload(0x3840), f_q))
            mstore(0x38a0, mulmod(mload(0x2920), mload(0x2e60), f_q))
            mstore(0x38c0, mulmod(mload(0x2940), mload(0x2e60), f_q))
            mstore(0x38e0, mulmod(mload(0x2960), mload(0x2e60), f_q))
            {
                let result := mulmod(mload(0x2980), mload(0x2c00), f_q)
                mstore(14592, result)
            }
            mstore(0x3920, mulmod(mload(0x3900), mload(0x2fe0), f_q))
            mstore(0x3940, mulmod(sub(f_q, mload(0x3920)), mload(0x30c0), f_q))
            mstore(0x3960, mulmod(mload(0x33a0), mload(0x30c0), f_q))
            mstore(0x3980, mulmod(mload(0x38a0), mload(0x30c0), f_q))
            mstore(0x39a0, mulmod(mload(0x38c0), mload(0x30c0), f_q))
            mstore(0x39c0, mulmod(mload(0x38e0), mload(0x30c0), f_q))
            mstore(0x39e0, addmod(mload(0x3880), mload(0x3940), f_q))
            {
                let result := mulmod(mload(0x860), mload(0x2c00), f_q)
                mstore(14848, result)
            }
            mstore(0x3a20, mulmod(mload(0x3a00), mload(0x2fe0), f_q))
            mstore(0x3a40, mulmod(sub(f_q, mload(0x3a20)), mload(0x30e0), f_q))
            mstore(0x3a60, mulmod(mload(0x33a0), mload(0x30e0), f_q))
            mstore(0x3a80, addmod(mload(0x39e0), mload(0x3a40), f_q))
            mstore(0x3aa0, mulmod(mload(0x3a80), mload(0x3120), f_q))
            mstore(0x3ac0, mulmod(mload(0x3420), mload(0x3120), f_q))
            mstore(0x3ae0, mulmod(mload(0x34a0), mload(0x3120), f_q))
            mstore(0x3b00, mulmod(mload(0x3540), mload(0x3120), f_q))
            mstore(0x3b20, mulmod(mload(0x35e0), mload(0x3120), f_q))
            mstore(0x3b40, mulmod(mload(0x3680), mload(0x3120), f_q))
            mstore(0x3b60, mulmod(mload(0x3720), mload(0x3120), f_q))
            mstore(0x3b80, mulmod(mload(0x37c0), mload(0x3120), f_q))
            mstore(0x3ba0, mulmod(mload(0x3860), mload(0x3120), f_q))
            mstore(0x3bc0, mulmod(mload(0x3960), mload(0x3120), f_q))
            mstore(0x3be0, mulmod(mload(0x3980), mload(0x3120), f_q))
            mstore(0x3c00, mulmod(mload(0x39a0), mload(0x3120), f_q))
            mstore(0x3c20, mulmod(mload(0x39c0), mload(0x3120), f_q))
            mstore(0x3c40, mulmod(mload(0x3a60), mload(0x3120), f_q))
            mstore(0x3c60, addmod(mload(0x3380), mload(0x3aa0), f_q))
            mstore(0x3c80, mulmod(1, mload(0x2ba0), f_q))
            mstore(0x3ca0, mulmod(1, mload(0xaa0), f_q))
            mstore(0x3cc0, 0x0000000000000000000000000000000000000000000000000000000000000001)
            mstore(0x3ce0, 0x0000000000000000000000000000000000000000000000000000000000000002)
            mstore(0x3d00, mload(0x3c60))
            success := and(eq(staticcall(gas(), 0x7, 0x3cc0, 0x60, 0x3cc0, 0x40), 1), success)
            mstore(0x3d20, mload(0x3cc0))
            mstore(0x3d40, mload(0x3ce0))
            mstore(0x3d60, mload(0x340))
            mstore(0x3d80, mload(0x360))
            success := and(eq(staticcall(gas(), 0x6, 0x3d20, 0x80, 0x3d20, 0x40), 1), success)
            mstore(0x3da0, mload(0x4e0))
            mstore(0x3dc0, mload(0x500))
            mstore(0x3de0, mload(0x3340))
            success := and(eq(staticcall(gas(), 0x7, 0x3da0, 0x60, 0x3da0, 0x40), 1), success)
            mstore(0x3e00, mload(0x3d20))
            mstore(0x3e20, mload(0x3d40))
            mstore(0x3e40, mload(0x3da0))
            mstore(0x3e60, mload(0x3dc0))
            success := and(eq(staticcall(gas(), 0x6, 0x3e00, 0x80, 0x3e00, 0x40), 1), success)
            mstore(0x3e80, mload(0x520))
            mstore(0x3ea0, mload(0x540))
            mstore(0x3ec0, mload(0x3360))
            success := and(eq(staticcall(gas(), 0x7, 0x3e80, 0x60, 0x3e80, 0x40), 1), success)
            mstore(0x3ee0, mload(0x3e00))
            mstore(0x3f00, mload(0x3e20))
            mstore(0x3f20, mload(0x3e80))
            mstore(0x3f40, mload(0x3ea0))
            success := and(eq(staticcall(gas(), 0x6, 0x3ee0, 0x80, 0x3ee0, 0x40), 1), success)
            mstore(0x3f60, mload(0x3e0))
            mstore(0x3f80, mload(0x400))
            mstore(0x3fa0, mload(0x3ac0))
            success := and(eq(staticcall(gas(), 0x7, 0x3f60, 0x60, 0x3f60, 0x40), 1), success)
            mstore(0x3fc0, mload(0x3ee0))
            mstore(0x3fe0, mload(0x3f00))
            mstore(0x4000, mload(0x3f60))
            mstore(0x4020, mload(0x3f80))
            success := and(eq(staticcall(gas(), 0x6, 0x3fc0, 0x80, 0x3fc0, 0x40), 1), success)
            mstore(0x4040, 0x1d6718adbe94c09e5daadf44890307471aa17d9c2978ca0b661cf1e831bb587c)
            mstore(0x4060, 0x13e07ac5837c43005c2a492687db06e0993d2f0bab8de10f82d22304d2ec2974)
            mstore(0x4080, mload(0x3ae0))
            success := and(eq(staticcall(gas(), 0x7, 0x4040, 0x60, 0x4040, 0x40), 1), success)
            mstore(0x40a0, mload(0x3fc0))
            mstore(0x40c0, mload(0x3fe0))
            mstore(0x40e0, mload(0x4040))
            mstore(0x4100, mload(0x4060))
            success := and(eq(staticcall(gas(), 0x6, 0x40a0, 0x80, 0x40a0, 0x40), 1), success)
            mstore(0x4120, 0x1d0a4b9f74733b42c92e271ad8fa62e22bcae8350f5e3b9dc3e0ecb236afd3c3)
            mstore(0x4140, 0x17300dd69d36140cc2f0ec0a4105cbddbbeecd48e5adfc26b14d0534ad95c65c)
            mstore(0x4160, mload(0x3b00))
            success := and(eq(staticcall(gas(), 0x7, 0x4120, 0x60, 0x4120, 0x40), 1), success)
            mstore(0x4180, mload(0x40a0))
            mstore(0x41a0, mload(0x40c0))
            mstore(0x41c0, mload(0x4120))
            mstore(0x41e0, mload(0x4140))
            success := and(eq(staticcall(gas(), 0x6, 0x4180, 0x80, 0x4180, 0x40), 1), success)
            mstore(0x4200, 0x2bac122948ea403b5efbd7649325dc298e50678275f1337ed50e11f936a282e9)
            mstore(0x4220, 0x27a91f00605b9c1323b4d0b6feda9e350540f41785bb3ff2ec8b2bd200faef8f)
            mstore(0x4240, mload(0x3b20))
            success := and(eq(staticcall(gas(), 0x7, 0x4200, 0x60, 0x4200, 0x40), 1), success)
            mstore(0x4260, mload(0x4180))
            mstore(0x4280, mload(0x41a0))
            mstore(0x42a0, mload(0x4200))
            mstore(0x42c0, mload(0x4220))
            success := and(eq(staticcall(gas(), 0x6, 0x4260, 0x80, 0x4260, 0x40), 1), success)
            mstore(0x42e0, 0x18d98225ee5ac3affae400e1af0347c4e0024206e84503eea92bd4281d6e781c)
            mstore(0x4300, 0x1203effb45c7591a826949c0f5d380157c4c5e3b4aedd69a33c575962c2a5b96)
            mstore(0x4320, mload(0x3b40))
            success := and(eq(staticcall(gas(), 0x7, 0x42e0, 0x60, 0x42e0, 0x40), 1), success)
            mstore(0x4340, mload(0x4260))
            mstore(0x4360, mload(0x4280))
            mstore(0x4380, mload(0x42e0))
            mstore(0x43a0, mload(0x4300))
            success := and(eq(staticcall(gas(), 0x6, 0x4340, 0x80, 0x4340, 0x40), 1), success)
            mstore(0x43c0, 0x1b96c16fc238627dc0d44b602aa4747d27848d64021c3904afe57c9c576dd665)
            mstore(0x43e0, 0x2f12e353f6e06dfb570389adf551f18d89aa2cb184c0f596b4430746fde8a2c4)
            mstore(0x4400, mload(0x3b60))
            success := and(eq(staticcall(gas(), 0x7, 0x43c0, 0x60, 0x43c0, 0x40), 1), success)
            mstore(0x4420, mload(0x4340))
            mstore(0x4440, mload(0x4360))
            mstore(0x4460, mload(0x43c0))
            mstore(0x4480, mload(0x43e0))
            success := and(eq(staticcall(gas(), 0x6, 0x4420, 0x80, 0x4420, 0x40), 1), success)
            mstore(0x44a0, 0x11a21c36608c7d80205a591682e80d8fa80bb7b746f56c80a2909a5482060e9a)
            mstore(0x44c0, 0x2c9bc49f65fec47f420c6e2858361c5cf612cfcf00101663ebd0fa769bbee145)
            mstore(0x44e0, mload(0x3b80))
            success := and(eq(staticcall(gas(), 0x7, 0x44a0, 0x60, 0x44a0, 0x40), 1), success)
            mstore(0x4500, mload(0x4420))
            mstore(0x4520, mload(0x4440))
            mstore(0x4540, mload(0x44a0))
            mstore(0x4560, mload(0x44c0))
            success := and(eq(staticcall(gas(), 0x6, 0x4500, 0x80, 0x4500, 0x40), 1), success)
            mstore(0x4580, 0x0445da2ddc2fd6753b3943c6ed6238462054ffa77b38789f44e093262f32800d)
            mstore(0x45a0, 0x1ddba71c4e65399840ac4eb67d9266ee80124a75c33a23f563c3c7767cd368ef)
            mstore(0x45c0, mload(0x3ba0))
            success := and(eq(staticcall(gas(), 0x7, 0x4580, 0x60, 0x4580, 0x40), 1), success)
            mstore(0x45e0, mload(0x4500))
            mstore(0x4600, mload(0x4520))
            mstore(0x4620, mload(0x4580))
            mstore(0x4640, mload(0x45a0))
            success := and(eq(staticcall(gas(), 0x6, 0x45e0, 0x80, 0x45e0, 0x40), 1), success)
            mstore(0x4660, mload(0x600))
            mstore(0x4680, mload(0x620))
            mstore(0x46a0, mload(0x3bc0))
            success := and(eq(staticcall(gas(), 0x7, 0x4660, 0x60, 0x4660, 0x40), 1), success)
            mstore(0x46c0, mload(0x45e0))
            mstore(0x46e0, mload(0x4600))
            mstore(0x4700, mload(0x4660))
            mstore(0x4720, mload(0x4680))
            success := and(eq(staticcall(gas(), 0x6, 0x46c0, 0x80, 0x46c0, 0x40), 1), success)
            mstore(0x4740, mload(0x640))
            mstore(0x4760, mload(0x660))
            mstore(0x4780, mload(0x3be0))
            success := and(eq(staticcall(gas(), 0x7, 0x4740, 0x60, 0x4740, 0x40), 1), success)
            mstore(0x47a0, mload(0x46c0))
            mstore(0x47c0, mload(0x46e0))
            mstore(0x47e0, mload(0x4740))
            mstore(0x4800, mload(0x4760))
            success := and(eq(staticcall(gas(), 0x6, 0x47a0, 0x80, 0x47a0, 0x40), 1), success)
            mstore(0x4820, mload(0x680))
            mstore(0x4840, mload(0x6a0))
            mstore(0x4860, mload(0x3c00))
            success := and(eq(staticcall(gas(), 0x7, 0x4820, 0x60, 0x4820, 0x40), 1), success)
            mstore(0x4880, mload(0x47a0))
            mstore(0x48a0, mload(0x47c0))
            mstore(0x48c0, mload(0x4820))
            mstore(0x48e0, mload(0x4840))
            success := and(eq(staticcall(gas(), 0x6, 0x4880, 0x80, 0x4880, 0x40), 1), success)
            mstore(0x4900, mload(0x6c0))
            mstore(0x4920, mload(0x6e0))
            mstore(0x4940, mload(0x3c20))
            success := and(eq(staticcall(gas(), 0x7, 0x4900, 0x60, 0x4900, 0x40), 1), success)
            mstore(0x4960, mload(0x4880))
            mstore(0x4980, mload(0x48a0))
            mstore(0x49a0, mload(0x4900))
            mstore(0x49c0, mload(0x4920))
            success := and(eq(staticcall(gas(), 0x6, 0x4960, 0x80, 0x4960, 0x40), 1), success)
            mstore(0x49e0, mload(0x560))
            mstore(0x4a00, mload(0x580))
            mstore(0x4a20, mload(0x3c40))
            success := and(eq(staticcall(gas(), 0x7, 0x49e0, 0x60, 0x49e0, 0x40), 1), success)
            mstore(0x4a40, mload(0x4960))
            mstore(0x4a60, mload(0x4980))
            mstore(0x4a80, mload(0x49e0))
            mstore(0x4aa0, mload(0x4a00))
            success := and(eq(staticcall(gas(), 0x6, 0x4a40, 0x80, 0x4a40, 0x40), 1), success)
            mstore(0x4ac0, mload(0xa40))
            mstore(0x4ae0, mload(0xa60))
            mstore(0x4b00, sub(f_q, mload(0x3c80)))
            success := and(eq(staticcall(gas(), 0x7, 0x4ac0, 0x60, 0x4ac0, 0x40), 1), success)
            mstore(0x4b20, mload(0x4a40))
            mstore(0x4b40, mload(0x4a60))
            mstore(0x4b60, mload(0x4ac0))
            mstore(0x4b80, mload(0x4ae0))
            success := and(eq(staticcall(gas(), 0x6, 0x4b20, 0x80, 0x4b20, 0x40), 1), success)
            mstore(0x4ba0, mload(0xae0))
            mstore(0x4bc0, mload(0xb00))
            mstore(0x4be0, mload(0x3ca0))
            success := and(eq(staticcall(gas(), 0x7, 0x4ba0, 0x60, 0x4ba0, 0x40), 1), success)
            mstore(0x4c00, mload(0x4b20))
            mstore(0x4c20, mload(0x4b40))
            mstore(0x4c40, mload(0x4ba0))
            mstore(0x4c60, mload(0x4bc0))
            success := and(eq(staticcall(gas(), 0x6, 0x4c00, 0x80, 0x4c00, 0x40), 1), success)
            mstore(0x4c80, mload(0x4c00))
            mstore(0x4ca0, mload(0x4c20))
            mstore(0x4cc0, mload(0xae0))
            mstore(0x4ce0, mload(0xb00))
            mstore(0x4d00, mload(0xb20))
            mstore(0x4d20, mload(0xb40))
            mstore(0x4d40, mload(0xb60))
            mstore(0x4d60, mload(0xb80))
            mstore(0x4d80, keccak256(0x4c80, 256))
            mstore(19872, mod(mload(19840), f_q))
            mstore(0x4dc0, mulmod(mload(0x4da0), mload(0x4da0), f_q))
            mstore(0x4de0, mulmod(1, mload(0x4da0), f_q))
            mstore(0x4e00, mload(0x4d00))
            mstore(0x4e20, mload(0x4d20))
            mstore(0x4e40, mload(0x4de0))
            success := and(eq(staticcall(gas(), 0x7, 0x4e00, 0x60, 0x4e00, 0x40), 1), success)
            mstore(0x4e60, mload(0x4c80))
            mstore(0x4e80, mload(0x4ca0))
            mstore(0x4ea0, mload(0x4e00))
            mstore(0x4ec0, mload(0x4e20))
            success := and(eq(staticcall(gas(), 0x6, 0x4e60, 0x80, 0x4e60, 0x40), 1), success)
            mstore(0x4ee0, mload(0x4d40))
            mstore(0x4f00, mload(0x4d60))
            mstore(0x4f20, mload(0x4de0))
            success := and(eq(staticcall(gas(), 0x7, 0x4ee0, 0x60, 0x4ee0, 0x40), 1), success)
            mstore(0x4f40, mload(0x4cc0))
            mstore(0x4f60, mload(0x4ce0))
            mstore(0x4f80, mload(0x4ee0))
            mstore(0x4fa0, mload(0x4f00))
            success := and(eq(staticcall(gas(), 0x6, 0x4f40, 0x80, 0x4f40, 0x40), 1), success)
            mstore(0x4fc0, mload(0x4e60))
            mstore(0x4fe0, mload(0x4e80))
            mstore(0x5000, 0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2)
            mstore(0x5020, 0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed)
            mstore(0x5040, 0x090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b)
            mstore(0x5060, 0x12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa)
            mstore(0x5080, mload(0x4f40))
            mstore(0x50a0, mload(0x4f60))
            mstore(0x50c0, 0x29d8d535d03a8dbfe649850c3ad2b89d92f2bd37e5acda4cf388025bdc31fd32)
            mstore(0x50e0, 0x188c95e5e6b71364b1ced1159509e6f642051c787da379b61bde88550a463f7f)
            mstore(0x5100, 0x09abaad5291d0bf5e9f561fb0faf6bc3151ef65f29df18381cf1af17cbeb8216)
            mstore(0x5120, 0x1157f8d92f6abc7e531183e84da719d5a47bda7d0c0cffe091101f7ef2a10f4e)
            success := and(eq(staticcall(gas(), 0x8, 0x4fc0, 0x180, 0x4fc0, 0x20), 1), success)
            success := and(eq(mload(0x4fc0), 1), success)

            // Revert if anything fails
            if iszero(success) { revert(0, 0) }

            // Return empty bytes on success
            return(0, 0)
        }
    }
}