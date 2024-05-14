declare module 'translate-google' {
    interface Options {
        from?: string; 
        to: string; 
        raw?: boolean; 
        client?: string;
        tld?: string; 
    }
     
    function translate(text: string, options: Options): Promise<string>; 

    export = translate; 
}