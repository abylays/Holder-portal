import cloudWalletApi from './apiService';
import {storeSignedVCs} from './apiService';


describe('Test apiService', () => {
    
    test('storeSignedVCs function', async () =>{
        jest.spyOn(cloudWalletApi, 'post').mockResolvedValue({
            data: 'someResponseData'
        })
        const data = await storeSignedVCs('someData');
        expect(cloudWalletApi.post).toBeCalledWith('/wallet/credentials', 'someData')
        expect(data).toEqual('someResponseData')
    })
})