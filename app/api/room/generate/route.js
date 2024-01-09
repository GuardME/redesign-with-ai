import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY
})

export const POST = async (req) => {
    const { imageUrl, theme, room, userId, email } = await req.json();

    console.log('imageUrl', imageUrl )
    const model = 
    "jagilley/controlnet-hough:854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b";
    const input = {
        image: imageUrl,
        prompt:
         room === 'Gaming Room'
            ? "a room for gaming with computers, gaming consoles, and gaming chairs"
            : `a ${theme.toLowerCase()} ${room.toLowerCase()} Editorial style Photo, Symmetry, Straight On, Modern Living Room, Large Window, Leather, Glass, Metal, Wood Paneling, Neutral Palatte`,
        a_prompt:
         "best quality, extremely detailed, photo from Pinterest, cinematic photo, ultra-detailed, ultra-realistic, award-winning",
        n_prompt:
         "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digits, fewer digits, cropped, worst quality, low quality",
    };
    const output = await replicate.run(model, { input });
    console.log(output);
    return new Response(JSON.stringify(output), { status: 200 });

}