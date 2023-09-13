export function getLatLng(address: string): Promise<Record<string, number>> {
  return new Promise((resolve, reject) => {
    naver.maps.Service.geocode({
      query: address
    }, function (status, response) {
      const data = response.v2.addresses[0];
      const { x, y } = data;
      resolve({ lng: Number(x), lat: Number(y) });
    });
  });
}
