import axios from "axios"
import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils"

export class xsLockerApi {
    public async getXsLocker() {
        return await axios.get('https://stats.solace.fi/analytics/').then((data: any) => {
            const xsLocker = data.data.xslocker
            return xsLocker
        })
    }

    public async getVotePowerByAccount() {

        function votePowerOfLock(xslock: any, time: any) {
            // The maximum duration of a lock in seconds.
            const MAX_LOCK_DURATION = 60 * 60 * 24 * 365 * 4; // 4 years
            // The vote power multiplier at max lock in bps.
            const MAX_LOCK_MULTIPLIER_BPS = 40000;  // 4X
            // The vote power multiplier when unlocked in bps.
            const UNLOCKED_MULTIPLIER_BPS = 10000; // 1X
            // 1 bps = 1/10000
            const MAX_BPS = 10000;
          
            let end = BigNumber.from(xslock.end)
            let amount = BigNumber.from(xslock.amount)
            let base = amount.mul(UNLOCKED_MULTIPLIER_BPS).div(MAX_BPS)
            let bonus = (end.lte(time))
              ? 0
              : (amount.mul(end.sub(time)).mul(MAX_LOCK_MULTIPLIER_BPS-UNLOCKED_MULTIPLIER_BPS).div(MAX_LOCK_DURATION*MAX_BPS))
            return base.add(bonus)
          }

        return await axios.get('https://stats.solace.fi/analytics/').then((data: any) => {
            const xsLocker = data.data.xslocker
            let keys = Object.keys(xsLocker)
            let now = Math.floor(Date.now()/1000)
            let owners: any = {}
            keys.forEach(chainID => {
                console.log(chainID, typeof(chainID), xsLocker[chainID])
                xsLocker[chainID].forEach((xslock: any) => {
                  if(!owners.hasOwnProperty(xslock.owner)) owners[xslock.owner] = BigNumber.from(0)
                  owners[xslock.owner] = owners[xslock.owner].add(votePowerOfLock(xslock, now))
                })
              })
            let ownerArr: any[] = Object.keys(owners).map(owner => {
              return {name: owner, votePower: formatUnits(owners[owner],18)}
            })
            ownerArr.sort((a,b) => b.votePower - a.votePower)

            return ownerArr
        })
    }
}